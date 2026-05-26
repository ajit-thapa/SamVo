import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import RebalCanvas from '@/components/RebalCanvas';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RebalPage() {
  return (
    <AuthGuard>
      <Layout>
        <ErrorBoundary>
          <RebalCanvas />
        </ErrorBoundary>
      </Layout>
    </AuthGuard>
  );
}
