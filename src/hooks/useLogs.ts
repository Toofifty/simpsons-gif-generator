import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

type Log = {
  id: number;
  createdAt: string;
  status: number;
  requestPath: string;
  body: string;
  success: boolean;
  responseTime: number;
  renderTime?: number;
};

const LIMIT = 50;

export const useLogs = () => {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('term=');
  const [logs, setLogs] = useState<Log[]>();
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      const response = await api.logs({
        offset: page * LIMIT || undefined,
        limit: LIMIT,
        filter,
      });
      if ('error' in response) {
        console.error(response.error);
        return;
      }

      setLogs(response.data.logs);
      setTotal(response.data.total);
      setLoading(false);
    }, 50);
    return () => clearTimeout(timeout);
  }, [page, filter]);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);
  const prevPage = useCallback(() => {
    setPage((p) => p - 1);
  }, []);

  return {
    nextPage,
    prevPage,
    page,
    logs,
    total,
    loading,
    filter,
    setFilter,
  };
};
