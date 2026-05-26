import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import { getSessions, saveSession, Session } from '@/lib/db';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function Logbook() {
  const queryClient = useQueryClient();
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const [focus, setFocus] = useState(10);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');

  const mutation = useMutation({
    mutationFn: (newSession: Omit<Session, 'id' | 'user_id' | 'created_at'>) =>
      saveSession(newSession),
    onMutate: async (newSession) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['sessions'] });

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(['sessions']);

      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], (old: Session[] = []) => [
        {
          id: Math.random().toString(),
          user_id: 'optimistic',
          focus_level: newSession.focus_level,
          duration_minutes: newSession.duration_minutes,
          notes: newSession.notes,
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousSessions };
    },
    onError: (err, newSession, context) => {
      // Revert on error
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setFocus(10);
      setDuration(0);
      setNotes('');
    },
  });

  const handleSubmit = () => {
    if (!focus || duration <= 0) {
      alert('Enter focus level and positive duration');
      return;
    }
    mutation.mutate({ focus_level: focus, duration_minutes: duration, notes });
  };

  return (
    <AuthGuard>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Your SamVo Logbook</h1>
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Record a Session</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Focus level (10,12,etc)"
              value={focus}
              onChange={e => setFocus(parseInt(e.target.value) || 0)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 0)}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Notes / experiences / insights"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="border p-2 rounded col-span-2"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="bg-indigo-600 text-white py-2 rounded col-span-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Saving...' : 'Save to Logbook'}
            </button>
            {mutation.isError && (
              <p className="text-red-500 text-sm col-span-2">
                Error saving session. Please try again.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isLoading && <p>Loading your sessions...</p>}
          {sessions.length === 0 && !isLoading && (
            <p className="text-gray-400">No sessions yet. Start meditating and save your experiences.</p>
          )}
          {sessions.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between flex-wrap">
                <span className="font-bold text-indigo-800">Focus {s.focus_level}</span>
                <span className="text-sm text-gray-500">
                  {s.created_at ? new Date(s.created_at).toLocaleString() : 'Just now'}
                </span>
              </div>
              <p>⏱️ {s.duration_minutes} minutes</p>
              {s.notes && <p className="text-gray-700 mt-2">{s.notes}</p>}
            </div>
          ))}
        </div>
      </Layout>
    </AuthGuard>
  );
}
