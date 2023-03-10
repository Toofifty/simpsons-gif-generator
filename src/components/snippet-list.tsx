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

export const SnippetList = () => {
  const { loading, snippets, total } = useSnippets();

  if (loading) {
    return (
      <Group position="center" m="xl">
        <Loader color="gray" m="xl" />
      </Group>
    );
  }

  if (total === 0 || snippets.length === 0) {
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
    <Flex wrap="wrap" gap="lg">
      {snippets.map((snippet) => (
        <SnippetPreview key={snippet.uuid} snippet={snippet} />
      ))}
      {total > snippets.length && (
        <Paper w={300} radius="sm" p="xl">
          <Flex justify="center" align="center" h="100%">
            <Button variant="filled">Load more ...</Button>
          </Flex>
        </Paper>
      )}
    </Flex>
  );
};
