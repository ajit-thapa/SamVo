import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function VerifyEmail() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email_confirmed_at) {
        router.push('/');
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, [router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      setMessage('Verification email sent! Check your inbox.');
    } catch (err) {
      setMessage('Failed to resend email. Try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-indigo-800 mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-4">We've sent a confirmation link to <strong>{user?.email}</strong></p>
        <p className="text-gray-500 text-sm mb-6">Click the link in your email to activate your account.</p>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </div>
    </div>
  );
}
