import { Divider, Loader, Stack, Text } from '@mantine/core';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { SearchQuoteResponseData } from '../../api';
import { SearchResult } from './search-result';

interface LoaderProps {
  onIntersect: () => void;
}

const ScrollTrigger = ({ onIntersect }: LoaderProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onIntersect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(document.querySelector('#search-scroll-trigger')!);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect]);

  return (
    <Text ta="center">
      <Loader id="search-scroll-trigger" />
    </Text>
  );
};

interface SearchResultsProps {
  loading?: boolean;
  term?: string;
  results?: SearchQuoteResponseData;
  onNext: () => void;
}

export const SearchResults = forwardRef(
  (
    { loading, term, results, onNext }: SearchResultsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    if (results === undefined && (term?.length ?? 0) < 5) {
      return <Text ta="center">Term is too short</Text>;
    }

    if (loading || results === undefined) {
      return <Text ta="center">Loading...</Text>;
    }

    if (results.matches.length === 0) {
      return <Text ta="center">No results found</Text>;
    }

    return (
      <Stack ref={ref} mah="calc(100vh - 200px)">
        <Stack style={{ overflowY: 'auto' }} mah={580}>
          {results.matches.map((result, i) => (
            <SearchResult
              first={i === 0}
              key={result.lines[0].id + i * 0xdeadbeef}
              result={result}
            />
          ))}
          {results.matches.length < results.total_results && (
            <ScrollTrigger onIntersect={onNext} />
          )}
        </Stack>
        {results.total_results - results.matches.length > 0 && (
          <>
            <Divider />
            <Text ta="center" c="dimmed">
              {results.total_results - results.matches.length} more results
            </Text>
          </>
        )}
      </Stack>
    );
  }
);
