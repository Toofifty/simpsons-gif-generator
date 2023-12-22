import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { api, Snippet } from '../api';

let inflight = false;

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    if (inflight) {
      return;
    }

    inflight = true;
    setLoading(true);
    const response = await api.snippets({
      offset: snippets.length || undefined,
      limit: 12,
    });
    if ('error' in response) {
      notifications.show({
        title: "Couldn't fetch published snippets",
        message: response.error,
      });
      return;
    }

    setSnippets((snippets) => [...snippets, ...response.data.results]);
    setTotal(response.data.count);
    setLoading(false);
    inflight = false;
  };

  useEffect(() => {
    fetchMore();
  }, []);

  return { snippets, loading, total, fetchMore };
};
