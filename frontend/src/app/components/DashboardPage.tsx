import { useAuth } from '../contexts/AuthContext';
import { ManufacturerDashboard } from './ManufacturerDashboard';
import { PharmacyPortal } from './PharmacyPortal';
import { RegulatorDashboard } from './RegulatorDashboard';
import { ConsumerDashboard } from './ConsumerDashboard';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'pharmacy':
      return <PharmacyPortal />;
    case 'regulator':
      return <RegulatorDashboard />;
    case 'consumer':
    default:
      return <ConsumerDashboard />;
  }
}
