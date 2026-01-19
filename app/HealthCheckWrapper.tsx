// app/HealthCheckWrapper.tsx

import { checkBackendHealth } from '@/lib/services';
import ServerDownPage from '@/components/ServerDownPage';

interface HealthCheckWrapperProps {
  children: React.ReactNode;
}

/**
 * Server component that checks backend health before rendering the app
 * If the backend is down, displays an error page instead
 */
export default async function HealthCheckWrapper({ children }: HealthCheckWrapperProps) {
  console.log('[HealthCheckWrapper] Running health check...');
  const isHealthy = await checkBackendHealth();
  console.log('[HealthCheckWrapper] Health check result:', isHealthy ? 'HEALTHY ✓' : 'UNHEALTHY ✗');

  if (!isHealthy) {
    console.warn('[HealthCheckWrapper] Backend is down - rendering error page');
    return <ServerDownPage />;
  }

  console.log('[HealthCheckWrapper] Backend is healthy - rendering app');
  return <>{children}</>;
}
