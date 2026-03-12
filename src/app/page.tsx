import { auth } from '@/auth';
import ClientDashboard from '@/components/ClientDashboard';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <LandingPage />;
  }

  return <ClientDashboard userName={session.user?.name || session.user?.email || 'Reader'} />;
}
