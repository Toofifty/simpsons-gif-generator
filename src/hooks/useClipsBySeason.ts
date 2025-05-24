import { useMemo } from 'react';
import { api } from '../api';
import { usePaginatedRequest } from './usePaginatedRequest';
import { useCachedRequest } from './useCachedRequest';

export const useClipsBySeason = (filetype: 'gif' | 'mp4', season: number) => {
  const {
    results: clips,
    total,
    loading,
    error,
    fetchMore,
  } = usePaginatedRequest({
    cacheKey: 'clips-by-season',
    fetch: (offset, limit) =>
      api.clips({
        filetype,
        offset: offset || undefined,
        limit,
        'filter_by.episode.season': season,
        sort_by: 'episode_id',
        order: 'asc',
      }),
    dependencies: [filetype, season],
    limit: 16,
    errorMessage: "Couldn't fetch published clips",
  });

  const {
    data: episodes = [],
    loading: loadingEpisodes,
    error: errorEpisodes,
  } = useCachedRequest({
    cacheKey: 'episodes',
    fetch: () => api.episodes(),
    dependencies: [],
    errorMessage: "Couldn't fetch episodes",
  });

  const episodesWithClips = useMemo(
    () =>
      episodes
        .filter((episode) => episode.seasonId === season)
        .map((episode) => ({
          ...episode,
          clips: clips.filter((clip) => clip.episode_id === episode.id),
        }))
        .filter((episode) => episode.clips.length > 0),
    [episodes, clips, season]
  );

  return {
    episodes: episodesWithClips,
    clips,
    total,
    loading: loading || loadingEpisodes,
    error: error || errorEpisodes,
    fetchMore,
  };
};
