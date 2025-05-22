import {
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { api, SearchQuoteResponseData } from '../api';
import { runTransition } from '../util/with-transition';

interface QuoteSearchOptions {
  term: string;
}

export const useQuoteSearch = ({ term }: QuoteSearchOptions) => {
  const normalized = term
    .replaceAll('...', '…')
    .replaceAll(/[^a-zA-Z\…]/g, '')
    .replaceAll('…', '[...]');

  const [results, setResults] = useState<SearchQuoteResponseData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let discarded = false;
    (async () => {
      if (normalized.length >= 5) {
        setLoading(true);
        const response = await api.search({ term: normalized, limit: 5 });
        if (discarded) {
          return;
        }

        if ('error' in response) {
          console.error(response.error);
          setError(response.error);
          setLoading(false);
          return;
        }

        runTransition(() => {
          setResults(response.data);
          setLoading(false);
          setError(undefined);
        });
      } else {
        runTransition(() => {
          setResults(undefined);
        });
      }
    })();

    return () => {
      discarded = true;
    };
  }, [normalized]);

  const fetchMore = useCallback(async () => {
    const response = await api.search({
      term: normalized,
      offset: (results?.offset ?? 0) + (results?.limit ?? 0),
      limit: 5,
    });
    if ('error' in response) {
      console.error(response.error);
      return;
    }

    setResults((prev) => ({
      ...prev!,
      ...response.data,
      matches: [...prev!.matches, ...response.data.matches],
      clip_matches: [...prev!.clip_matches, ...response.data.clip_matches],
    }));
  }, [normalized, results]);

  return { results, loading, error, fetchMore };
};
