// app/HealthCheckWrapper.tsx

import { checkBackendHealth } from '@/lib/services';
import MaintenanceModal from '@/components/MaintenanceModal';

interface HealthCheckWrapperProps {
  children: React.ReactNode;
}

/**
 * Server component that checks backend health before rendering the app
 * If the backend is down, displays a maintenance modal
 * Can be disabled by setting NEXT_PUBLIC_ENSURE_BACKEND_RUNNING=false
 */
export default async function HealthCheckWrapper({ children }: HealthCheckWrapperProps) {
  // Check if health check is enabled (defaults to true if not set)
  const ensureBackendRunning = process.env.NEXT_PUBLIC_ENSURE_BACKEND_RUNNING !== 'false';
  
  if (!ensureBackendRunning) {
    console.log('[HealthCheckWrapper] Backend health check disabled - skipping');
    return <>{children}</>;
  }

  console.log('[HealthCheckWrapper] Running health check...');
  const isHealthy = await checkBackendHealth();
  console.log('[HealthCheckWrapper] Health check result:', isHealthy ? 'HEALTHY ✓' : 'UNHEALTHY ✗');

  if (!isHealthy) {
    console.warn('[HealthCheckWrapper] Backend is down - showing maintenance modal');
  }

  console.log('[HealthCheckWrapper] Rendering app with maintenance status:', !isHealthy);
  return (
    <>
      {children}
      <MaintenanceModal isOpen={!isHealthy} />
    </>
  );
}
