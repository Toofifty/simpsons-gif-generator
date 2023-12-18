import {
  Divider,
  Flex,
  Loader,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { MetaBundle, SearchQuoteResponseData, Subtitle } from '../../api';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { episodeIdentifier } from '../../utils';

interface SearchResultProps {
  result: {
    meta: MetaBundle;
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
  };
  first?: boolean;
}

const SearchResult = ({ result, first }: SearchResultProps) => {
  const { setRange } = useOptionsContext();

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const before = result.before.map((line) => (
    <Text key={line.id} color="dimmed">
      {line.text}
    </Text>
  ));

  const after = result.after.map((line) => (
    <Text key={line.id} color="dimmed">
      {line.text}
    </Text>
  ));

  const quote = result.lines.map((line) => (
    <Text
      key={line.id}
      color={theme.colorScheme === 'dark' ? 'white' : undefined}
    >
      {line.text}
    </Text>
  ));

  const episode = episodeIdentifier(result.meta);

  return (
    <>
      {!first && isMobile && <Divider />}
      <UnstyledButton
        w={isMobile ? 'calc(100vw - 4rem)' : 'calc(800px - 4rem)'}
        px="lg"
        py="sm"
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          ':hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
          },
        })}
        onClick={() => {
          setRange(
            result.lines[0].id,
            result.lines[result.lines.length - 1].id
          );
        }}
      >
        <Flex
          align={isMobile ? 'flex-start' : 'center'}
          justify="space-between"
          gap="lg"
          direction={isMobile ? 'column' : undefined}
        >
          <Text>
            {before}
            {quote}
            {after}
          </Text>
          <Text color="dimmed" ta={isMobile ? 'left' : 'right'}>
            <Text>{episode}</Text>
            <Text maw={300}>{result.meta.episode_title}</Text>
          </Text>
        </Flex>
      </UnstyledButton>
    </>
  );
};

interface LoaderProps {
  onIntersect: () => void;
}

const ScrollTrigger = ({ onIntersect }: LoaderProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          console.log('intersect!');
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
  results?: SearchQuoteResponseData;
  onNext: () => void;
}

export const SearchResults = forwardRef(
  (
    { loading, results, onNext }: SearchResultsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    if (loading) {
      return <Text ta="center">Loading...</Text>;
    }

    if (results === undefined) {
      return <Text ta="center">Term is too short</Text>;
    }

    if (results.matches.length === 0) {
      return <Text ta="center">No results found</Text>;
    }

    return (
      <Stack ref={ref} mah="calc(100vh - 200px)">
        <Stack sx={{ overflowY: 'auto' }} mah={580}>
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
            <Text ta="center" color="dimmed">
              {results.total_results - results.matches.length} more results
            </Text>
          </>
        )}
      </Stack>
    );
  }
);
