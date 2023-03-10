import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { api, Snippet } from '../api';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(async () => {
      const response = await api.snippets();
      if ('error' in response) {
        notifications.show({
          title: "Couldn't fetch published snippets",
          message: response.error,
        });
        return;
      }

      setSnippets(response.data.results);
      setTotal(response.data.count);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return { snippets, loading, total };
};
