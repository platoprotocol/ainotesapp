import { createClient } from '@/lib/supabase/client';
import type { Note } from '@/types';

export async function getNotes(): Promise<Note[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getNotesPaged(page: number, pageSize = 20): Promise<Note[]> {
  const supabase = createClient();
  const offset = page * pageSize;
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;
  return data ?? [];
}

export async function getNote(id: string): Promise<Note | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createNote(): Promise<Note> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .insert({ user_id: user.id, title: '', body: '' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  updates: Partial<Pick<Note, 'title' | 'body'>>
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notes').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}
