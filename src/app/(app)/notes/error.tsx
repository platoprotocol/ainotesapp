'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg font-semibold text-gray-800">Something went wrong</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        onClick={reset}
        className="text-sm text-indigo-600 hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
