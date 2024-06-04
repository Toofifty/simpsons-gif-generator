import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { api, Clip } from '../api';

let inflight = false;

export const useClips = (
  filetype: 'gif' | 'mp4',
  sort: 'recent' | 'popular'
) => {
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
      sort_by: sort === 'recent' ? 'created_at' : 'views',
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

  useEffect(() => {
    fetchMore();
  }, []);

  useEffect(() => {
    setClips([]);
    setTotal(0);
    fetchMore(true);
  }, [sort, filetype]);

  return { clips, loading, total, fetchMore };
};
