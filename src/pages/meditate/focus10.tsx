import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import FocusInduction from '@/components/FocusInduction';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Focus10Page() {
  return (
    <AuthGuard>
      <Layout>
        <ErrorBoundary>
          <FocusInduction target={10} />
        </ErrorBoundary>
      </Layout>
    </AuthGuard>
  );
}
