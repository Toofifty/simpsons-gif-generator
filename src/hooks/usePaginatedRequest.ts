import { useEffect, useRef, useState } from 'react';
import { APIError, APIResponse } from '../api';
import { notifications } from '@mantine/notifications';

type PaginatedData<T> = {
  results: T[];
  count: number;
};

type Results<T extends PaginatedData<unknown>> = T['results'];

class RequestCache {
  private cache: Map<string, PaginatedData<unknown>> = new Map();

  get<T extends PaginatedData<unknown>>(key: string): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, { results: [], count: 0 });
    }
    return this.cache.get(key) as T;
  }

  set<T extends PaginatedData<unknown>>(key: string, value: T) {
    this.cache.set(key, value);
  }

  put<T extends PaginatedData<unknown>>(key: string, value: T) {
    const cached = this.cache.get(key);
    if (cached) {
      const data = {
        results: [...cached.results, ...value.results],
        count: value.count,
      };
      this.cache.set(key, data);
      return data;
    }
    this.cache.set(key, value);
    return value;
  }
}
const cache = new RequestCache();

interface PaginatedRequestOptions<T extends PaginatedData<unknown>> {
  cacheKey: string;
  fetch: (offset: number, limit: number) => Promise<APIError | APIResponse<T>>;
  dependencies: unknown[];
  limit: number;
  errorMessage: string;
}

export const usePaginatedRequest = <T extends PaginatedData<unknown>>({
  cacheKey,
  fetch: _fetch,
  dependencies,
  limit,
  errorMessage,
}: PaginatedRequestOptions<T>) => {
  const key = `${cacheKey}/${dependencies.join('.')}`;

  const [results, setResults] = useState<Results<T>>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inflight = useRef(false);

  const fetch = async () => {
    if (inflight.current || error) {
      return;
    }
    inflight.current = true;

    const cached = cache.get<T>(key);

    if (cached.results.length === cached.count && cached.count > 0) {
      // if we have all the results in the cache, just return them
      setResults(cached.results);
      setTotal(cached.count);
      inflight.current = false;
      return;
    }

    // if we have enough more in the cache than in the state,
    // pull some more instead of fetching
    if (cached.results.length >= results.length + limit) {
      setResults(cached.results.slice(0, results.length + limit));
      inflight.current = false;
      return;
    }

    setLoading(true);
    const response = await _fetch(cached.results.length, limit);
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

    const stored = cache.put(key, response.data);
    setResults(stored.results);
    setTotal(stored.count);
    setLoading(false);
    inflight.current = false;
  };

  useEffect(() => {
    setResults([]);
    setTotal(0);
    setLoading(false);
    setError(undefined);

    const cached = cache.get<T>(key);

    if (cached.results.length >= limit) {
      // more in cache than in state, skip fetching
      // and put one request's worth in the state.
      // this makes sure not too many items are rendered
      // at once (while transitioning) which hurts performance
      setResults(cached.results.slice(0, limit));
      setTotal(cached.count);
      return;
    }

    fetch();
  }, [key]);

  return { results, total, loading, error, fetchMore: fetch };
};
