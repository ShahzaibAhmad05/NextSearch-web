// lib/services/health.ts

/**
 * Health check service for backend availability
 */

export interface HealthCheckResponse {
  ok: boolean;
  segments: number;
}

/**
 * Get the health check endpoint URL from environment variables
 */
function getHealthEndpoint(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE environment variable is not set');
  }
  return `${baseUrl}/api/health`;
}

/**
 * Check if the backend is healthy and ready to serve requests
 * @returns Promise that resolves to true if backend is healthy, false otherwise
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const healthEndpoint = getHealthEndpoint();
    console.log('[Health Check] Checking backend at:', healthEndpoint);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(healthEndpoint, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return false;
    }

    const data: HealthCheckResponse = await response.json();
    
    // Check if backend reports it's OK and has segments loaded
    const isHealthy = data.ok === true && data.segments > 0;
    console.log('[Health Check] Result:', isHealthy ? 'HEALTHY' : 'UNHEALTHY', data);
    
    return isHealthy;
  } catch (error) {
    console.error('[Health Check] Error:', error);
    return false;
  }
}
