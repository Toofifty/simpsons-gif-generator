import { api } from '../api';
import { usePaginatedRequest } from './usePaginatedRequest';

export const useClips = (
  filetype: 'gif' | 'mp4',
  sort: 'recent' | 'popular'
) => {
  const { results, total, loading, error, fetchMore } = usePaginatedRequest({
    cacheKey: 'clips',
    fetch: (offset, limit) =>
      api.clips({
        filetype,
        offset: offset || undefined,
        limit,
        sort_by: sort === 'recent' ? 'created_at' : 'views',
      }),
    dependencies: [filetype, sort],
    limit: 12,
    errorMessage: "Couldn't fetch published clips",
  });

  return { clips: results, total, loading, error, fetchMore };
};
