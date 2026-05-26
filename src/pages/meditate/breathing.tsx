import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import BreathingTimer from '@/components/BreathingTimer';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function BreathingPage() {
  return (
    <AuthGuard>
      <Layout>
        <ErrorBoundary>
          <BreathingTimer />
        </ErrorBoundary>
      </Layout>
    </AuthGuard>
  );
}
