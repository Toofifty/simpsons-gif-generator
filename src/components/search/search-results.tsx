import {
  ActionIcon,
  Badge,
  Divider,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { SearchQuoteResponseData } from '../../api';
import { SearchResult } from './search-result';
import { ScrollTrigger } from '../scroll-trigger';
import { IconClipboard, IconScissors, IconSearch } from '@tabler/icons-react';

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

    const totalMatches = results.matches.length + results.clip_matches.length;

    if (totalMatches === 0) {
      return <Text ta="center">No results found</Text>;
    }

    return (
      <Stack ref={ref} mah="calc(100vh - 200px)">
        <Stack style={{ overflowY: 'auto' }} mah={580} align="center">
          {results.clip_matches.length > 0 && (
            <>
              <Flex>
                <Badge
                  leftSection={
                    <ActionIcon color="blue" size="xs" variant="transparent">
                      <IconScissors />
                    </ActionIcon>
                  }
                >
                  Clips
                </Badge>
              </Flex>
              {results.clip_matches.map((result, i) => (
                <SearchResult
                  first={i === 0}
                  key={result.clip.uuid}
                  result={result}
                />
              ))}
              <Divider w="100%" />
            </>
          )}
          {results.clip_matches.length > 0 && (
            <Flex>
              <Badge
                leftSection={
                  <ActionIcon color="blue" size="xs" variant="transparent">
                    <IconSearch />
                  </ActionIcon>
                }
              >
                Search results
              </Badge>
            </Flex>
          )}
          {results.matches.map((result, i) => (
            <SearchResult
              first={i === 0}
              key={result.lines[0].id + i * 0xdeadbeef}
              result={result}
            />
          ))}
          {totalMatches < results.total_results && (
            <ScrollTrigger id="search-scroll-trigger" onIntersect={onNext}>
              <Loader />
            </ScrollTrigger>
          )}
        </Stack>
        {results.total_results - totalMatches > 0 && (
          <>
            <Divider />
            <Text ta="center" c="dimmed">
              {results.total_results - totalMatches} more results
            </Text>
          </>
        )}
      </Stack>
    );
  }
);
