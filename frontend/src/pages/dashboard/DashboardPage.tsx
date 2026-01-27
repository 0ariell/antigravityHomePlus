import { useAuthStore } from '../../app/stores';
import { ClientDashboard } from './ClientDashboard';
import { ProviderDashboard } from './ProviderDashboard';

export function DashboardPage() {
  const { user } = useAuthStore();

  if (user?.role === 'CLIENT') {
    return <ClientDashboard />;
  }

  return <ProviderDashboard />;
}
