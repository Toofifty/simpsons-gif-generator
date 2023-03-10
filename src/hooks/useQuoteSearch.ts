import { useEffect, useState } from 'react';
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
        const response = await api.search({ term: normalized });
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

  return { results, loading };
};
