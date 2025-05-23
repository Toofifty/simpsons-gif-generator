import { useEffect, useRef, useState } from 'react';
import { APIError, APIResponse } from '../api';
import { notifications } from '@mantine/notifications';

class RequestCache {
  private cache: Map<string, unknown> = new Map();

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T;
  }

  set<T>(key: string, value: T) {
    this.cache.set(key, value);
  }
}
const cache = new RequestCache();

interface CachedRequestOptions<T> {
  cacheKey: string;
  fetch: () => Promise<APIError | APIResponse<T>>;
  dependencies: unknown[];
  errorMessage: string;
}

export const useCachedRequest = <T>({
  cacheKey,
  fetch: _fetch,
  dependencies,
  errorMessage,
}: CachedRequestOptions<T>) => {
  const key = `${cacheKey}/${dependencies.join('.')}`;

  const cached = cache.get<T>(key);
  const [data, setData] = useState<T | undefined>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string>();
  const inflight = useRef(false);

  useEffect(() => {
    if (data) {
      return;
    }

    if (inflight.current) {
      return;
    }
    (async () => {
      inflight.current = true;
      setLoading(true);
      const response = await _fetch();
      if ('error' in response) {
        notifications.show({
          title: errorMessage,
          message: response.error,
        });
        setError(response.error);
        setLoading(false);
        inflight.current = false;
        return;
      }

      setData(response.data);
      cache.set(key, response.data);
      setLoading(false);
      inflight.current = false;
    })();
  }, dependencies);

  return { data, loading, error };
};
