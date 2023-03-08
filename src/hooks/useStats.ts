import { useEffect, useState } from 'react';
import { api, StatsResponseData } from '../api';

export const useStats = () => {
  const [stats, setStats] = useState<StatsResponseData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const response = await api.stats();
      if ('error' in response) {
        console.error(response.error);
        return;
      }

      setStats(response.data);
      setLoading(false);
    })();
  }, []);

  return { stats, loading };
};
