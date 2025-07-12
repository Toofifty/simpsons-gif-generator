import { useCallback, useEffect, useState } from 'react';
import { api, SearchQuoteResponseData } from '../api';
import { runTransition } from '../util/with-transition';
import { useDebounce } from './useDebounce';

interface QuoteSearchOptions {
  term: string;
  semanticSearch?: boolean;
}

const DEBOUNCE_MS = 500;
const SEARCH_LIMIT = 5;
const SEMANTIC_LIMIT = 10;

export const useQuoteSearch = ({
  term,
  semanticSearch,
}: QuoteSearchOptions) => {
  const normalized = semanticSearch
    ? term.trim()
    : term
        .replaceAll('...', '…')
        .replaceAll(/[^a-zA-Z0-9\…]/g, '')
        .replaceAll('…', '[...]');

  const [results, setResults] = useState<SearchQuoteResponseData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  let discarded = false;
  const [fetch, debouncing] = useDebounce(async () => {
    if (normalized.length >= 5) {
      setLoading(true);
      const response = await api.search({
        term: normalized,
        limit: semanticSearch ? SEMANTIC_LIMIT : SEARCH_LIMIT,
        semantic: semanticSearch,
      });
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
  }, DEBOUNCE_MS);

  useEffect(() => {
    if (!term && !results) {
      return;
    }

    fetch();

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

  return { results, loading, debouncing, error, fetchMore };
};
