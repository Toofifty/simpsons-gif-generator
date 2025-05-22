import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { api, Clip, Episode } from '../api';

let inflight = false;

export const useClipsByEpisode = (filetype: 'gif' | 'mp4') => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMore = async (forceRefresh?: boolean) => {
    if (inflight) {
      return;
    }

    inflight = true;
    setLoading(true);
    const response = await api.clips({
      filetype,
      offset: (forceRefresh ? 0 : clips.length) || undefined,
      limit: 12,
      sort_by: 'episode_id',
      order: 'asc',
    });
    if ('error' in response) {
      notifications.show({
        title: "Couldn't fetch published clips",
        message: response.error,
      });
      return;
    }

    setClips((clips) => [...clips, ...response.data.results]);
    setTotal(response.data.count);
    setLoading(false);
    inflight = false;
  };

  const fetchEpisodes = async () => {
    const response = await api.episodes();
    if ('error' in response) {
      notifications.show({
        title: "Couldn't fetch episodes",
        message: response.error,
      });
      return;
    }
    setEpisodes(response.data);
  };

  useEffect(() => {
    fetchMore();
    fetchEpisodes();
  }, []);

  useEffect(() => {
    setClips([]);
    setTotal(0);
    fetchMore(true);
  }, [filetype]);

  const episodesWithClips = useMemo(
    () =>
      episodes
        .map((episode) => {
          const episodeClips = clips.filter(
            (clip) => clip.episode_id === episode.id
          );
          return {
            ...episode,
            clips: episodeClips,
          };
        })
        .filter((episode) => episode.clips.length > 0),
    [episodes, clips]
  );

  const seasons = useMemo(() => {
    const seasons: Record<number, (Episode & { clips: Clip[] })[]> = {};
    episodesWithClips.forEach((episode) => {
      if (!seasons[episode.seasonId]) {
        seasons[episode.seasonId] = [];
      }
      seasons[episode.seasonId].push(episode);
    });
    return seasons;
  }, [episodesWithClips]);

  return { seasons, clips, loading, total, fetchMore };
};
