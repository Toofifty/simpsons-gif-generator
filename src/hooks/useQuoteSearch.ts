import { useCallback, useEffect, useState } from 'react';
import { api, SearchQuoteResponseData } from '../api';

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

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (normalized.length >= 5) {
        setLoading(true);
        const response = await api.search({ term: normalized, limit: 5 });
        if ('error' in response) {
          console.error(response.error);
          return;
        }

        setResults(response.data);
        setLoading(false);
      } else {
        setResults(undefined);
      }
    }, 500);
    return () => clearTimeout(timeout);
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
      ...response,
      matches: [...prev!.matches, ...response.data.matches],
    }));
  }, [normalized, results]);

  return { results, loading, fetchMore };
};
