'use client';

import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseRecordingOptions {
  onTranscript: (text: string) => void;
  onLimitReached: () => void;
}

export function useRecording({ onTranscript, onLimitReached }: UseRecordingOptions) {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const handleTranscribe = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = ['audio/webm', 'audio/mp4', 'audio/ogg'].find((t) =>
        MediaRecorder.isTypeSupported(t)
      );
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecordingState('processing');
        const blob = new Blob(chunksRef.current, { type: mimeType ?? 'audio/webm' });
        const ext = (mimeType ?? 'audio/webm').split('/')[1] ?? 'webm';
        const file = new File([blob], `recording.${ext}`, { type: mimeType ?? 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', file);
        try {
          const res = await fetch('/api/ai/transcribe', { method: 'POST', body: formData });
          if (res.status === 429) {
            onLimitReached();
            setRecordingState('idle');
            return;
          }
          const data = await res.json();
          if (data.transcript) {
            onTranscript(data.transcript);
          } else {
            toast.error('Transcription failed');
          }
        } catch {
          toast.error('Transcription failed');
        } finally {
          setRecordingState('idle');
        }
      };

      recorder.start();
      setRecordingState('recording');
    } catch {
      toast.error('Microphone access denied');
      setRecordingState('idle');
    }
  }, [onTranscript, onLimitReached]);

  return { recordingState, handleTranscribe, handleStopRecording };
}
