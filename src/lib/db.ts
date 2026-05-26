import { supabase } from './supabaseClient';

export type Session = {
  id?: string;
  user_id?: string;
  focus_level: number;
  duration_minutes: number;
  notes: string;
  created_at?: string;
};

export async function saveSession(session: Omit<Session, 'id' | 'user_id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meditation_sessions')
    .insert([{ ...session, user_id: user.id }])
    .select();
  if (error) throw error;
  return data;
}

export async function getSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Session[];
}
