import {
  Anchor,
  Button,
  Flex,
  Group,
  Loader,
  Paper,
  Text,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useSnippets } from '../hooks/useSnippets';
import { SnippetPreview } from './snippet-preview';
import { ScrollTrigger } from './scroll-trigger';

export const SnippetList = () => {
  const { loading, snippets, total, fetchMore } = useSnippets();

  if (!loading && (total === 0 || snippets.length === 0)) {
    return (
      <Group position="center" m="xl">
        <Text>
          No snippets available! Please try again later or{' '}
          <Anchor component={NavLink} to="/generate">
            generate your own
          </Anchor>
          .
        </Text>
      </Group>
    );
  }

  return (
    <>
      <Flex wrap="wrap" gap="lg">
        {snippets.map((snippet) => (
          <SnippetPreview key={snippet.uuid} snippet={snippet} />
        ))}
      </Flex>

      {total > snippets.length && (
        <Flex justify="center" align="center" h="100%">
          <ScrollTrigger id="snippet-scroll-trigger" onIntersect={fetchMore}>
            <Loader m={120} />
          </ScrollTrigger>
        </Flex>
      )}
    </>
  );
};
