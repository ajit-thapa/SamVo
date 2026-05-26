import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabaseClient';
import { getSessions } from '@/lib/db';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        const sessions = await getSessions();
        setSessionCount(sessions.length);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex justify-center items-center h-40">Loading...</div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-indigo-900">Welcome to SamVo, {user?.email}</h1>
          <p className="mt-2 text-gray-600">You have recorded {sessionCount} meditation session(s).</p>
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <Link href="/meditate/breathing" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-2">🌬️</div>
              <h3 className="font-bold">Resonant Breathing</h3>
              <p className="text-sm text-gray-500">Inhale, hold, exhale – cleanse energy</p>
            </Link>
            <Link href="/meditate/focus10" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-2">🧘</div>
              <h3 className="font-bold">Focus 10</h3>
              <p className="text-sm text-gray-500">Mind awake, body asleep</p>
            </Link>
            <Link href="/meditate/rebal" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-2">🎈</div>
              <h3 className="font-bold">REBAL</h3>
              <p className="text-sm text-gray-500">Build your energy balloon</p>
            </Link>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
