// lib/utils/search.ts

/**
 * Format result count to show first 3 significant digits
 */
export function formatResultCount(count: number): string {
  if (count < 1000) return count.toString();
  
  const magnitude = Math.floor(Math.log10(count));
  const divisor = Math.pow(10, magnitude - 2);
  const rounded = Math.round(count / divisor) * divisor;
  
  return rounded.toLocaleString();
}

/**
 * Generate search status message
 */
export function getSearchStatus(
  hasSearched: boolean,
  loading: boolean,
  error: string | null,
  resultsLength: number,
  found: number | undefined,
  backendTotalMs: number | null
): string {
  if (!hasSearched) return '';
  if (loading) return 'Searching…';
  if (error) return 'Error fetching results';
  if (resultsLength === 0) return 'No results found';

  const n = found ?? resultsLength;
  const formattedCount = formatResultCount(n);
  const parts: string[] = [`About ${formattedCount} result${n === 1 ? '' : 's'}`];

  if (backendTotalMs != null) {
    parts.push(`(${backendTotalMs.toFixed(2)} ms)`);
  }
  
  return parts.join(' ');
}
