import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-indigo-800">SamVo</Link>
          <div className="space-x-4 flex items-center">
            <Link href="/meditate/breathing" className="text-gray-600 hover:text-indigo-600 text-sm">Breathing</Link>
            <Link href="/meditate/focus10" className="text-gray-600 hover:text-indigo-600 text-sm">Focus 10</Link>
            <Link href="/meditate/focus12" className="text-gray-600 hover:text-indigo-600 text-sm">Focus 12</Link>
            <Link href="/meditate/rebal" className="text-gray-600 hover:text-indigo-600 text-sm">REBAL</Link>
            <Link href="/logbook" className="text-gray-600 hover:text-indigo-600 text-sm">Logbook</Link>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
