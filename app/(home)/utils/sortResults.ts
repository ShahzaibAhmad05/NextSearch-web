// app/(home)/utils/sortResults.ts
import { publishTimeToMs } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';
import type { SortOption } from '@/lib/constants';

/**
 * Sort search results based on the selected sort option
 */
export function getSortedResults(results: SearchResult[], sortBy: SortOption): SearchResult[] {
  if (sortBy === 'Relevancy') {
    return results;
  }

  const sorted = [...results];
  
  sorted.sort((a, b) => {
    const timeA = publishTimeToMs(a.publish_time);
    const timeB = publishTimeToMs(b.publish_time);

    const isInvalidA = Number.isNaN(timeA);
    const isInvalidB = Number.isNaN(timeB);

    // Push invalid dates to the end
    if (isInvalidA && isInvalidB) return 0;
    if (isInvalidA) return 1;
    if (isInvalidB) return -1;

    // Sort by date
    return sortBy === 'Publish Date (Newest)' ? timeB - timeA : timeA - timeB;
  });

  return sorted;
}
