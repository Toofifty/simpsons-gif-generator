import { Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import { ReactNode } from 'react';
import { MetaBundle, SearchQuoteResponseData, Subtitle } from '../../api';

interface SearchResultProps {
  result: {
    meta: MetaBundle;
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
  };
  setRange: (begin: number, end: number) => void;
}

const SearchResult = ({ result, setRange }: SearchResultProps) => {
  const before = result.before.map((line) => (
    <Text key={line.id} color="gray">
      {line.text}
    </Text>
  ));
  const after = result.after.map((line) => (
    <Text key={line.id} color="gray">
      {line.text}
    </Text>
  ));

  const quote = result.lines.map((line) => (
    <Text key={line.id}>{line.text}</Text>
  ));

  const episode = `S${(result.meta.season_number + '').padStart(2, '0')}E${(
    result.meta.episode_in_season + ''
  ).padStart(2, '0')}`;

  return (
    <UnstyledButton
      miw={800}
      px="lg"
      py="sm"
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        ':hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => {
        setRange(result.lines[0].id, result.lines[result.lines.length - 1].id);
      }}
    >
      <Flex align="center" justify="space-between">
        <Text>
          {before}
          {quote}
          {after}
        </Text>
        <Text color="gray" ta="right">
          <Text>{episode}</Text>
          <Text>{result.meta.episode_title}</Text>
        </Text>
      </Flex>
    </UnstyledButton>
  );
};

interface SearchResultsProps {
  loading?: boolean;
  term: string;
  results?: SearchQuoteResponseData;
  setRange: (begin: number, end: number) => void;
}

export const SearchResults = ({
  loading,
  term,
  results,
  setRange,
}: SearchResultsProps) => {
  if (loading) {
    return (
      <Text miw={560} ta="center">
        Loading...
      </Text>
    );
  }

  if (term.length === 0 && results === undefined) {
    return (
      <Text miw={560} ta="center">
        Begin typing to search quotes
      </Text>
    );
  }

  if (results === undefined) {
    return (
      <Text miw={560} ta="center">
        Term is too short
      </Text>
    );
  }

  if (results.matches.length === 0) {
    return (
      <Text miw={560} ta="center">
        No results found
      </Text>
    );
  }

  return (
    <Stack>
      {results.matches.slice(0, 10).map((result) => (
        <SearchResult
          key={result.lines[0].id}
          result={result}
          setRange={setRange}
        />
      ))}
    </Stack>
  );
};
