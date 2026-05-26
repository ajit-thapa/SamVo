import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import FocusInduction from '@/components/FocusInduction';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Focus12Page() {
  return (
    <AuthGuard>
      <Layout>
        <ErrorBoundary>
          <FocusInduction target={12} />
        </ErrorBoundary>
      </Layout>
    </AuthGuard>
  );
}
