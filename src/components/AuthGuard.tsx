import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      const user = session.user;
      if (!user.email_confirmed_at && !user.user_metadata?.email_verified) {
        router.push('/verify-email');
        return;
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
        return;
      }
      const user = session.user;
      if (!user.email_confirmed_at && !user.user_metadata?.email_verified) {
        router.push('/verify-email');
        return;
      }
      setLoading(false);
    });

    return () => listener?.subscription.unsubscribe();
  }, [router]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading SamVo...</p></div>;
  return <>{children}</>;
}
