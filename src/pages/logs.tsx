import {
  Box,
  Button,
  Card,
  Code,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useLogs } from '../hooks/useLogs';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { InputLabel } from '@mantine/core/lib/Input/InputLabel/InputLabel';

export default () => {
  const { prevPage, nextPage, loading, page, total, filter, setFilter, logs } =
    useLogs();

  return (
    <Box mx="auto" maw="calc(1200px + 6.75rem)">
      <Stack m="xl">
        <Text component="h1" size="2rem" mb="-lg">
          Logs
        </Text>
        <Flex direction="column" maw={400}>
          <TextInput
            label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Text mt="lg">
            Showing {page * 50} - {page * 50 + (logs?.length ?? 0)} of {total}{' '}
            results
          </Text>
        </Flex>
        <Card>
          {loading ? (
            <Flex align="center" justify="center" mih="50vh">
              <Loader />
            </Flex>
          ) : (
            logs?.map((log) => (
              <Flex justify="stretch">
                <Code block style={{ flexShrink: 0 }}>
                  {log.createdAt}
                </Code>
                <Code block style={{ flexGrow: 1 }}>
                  {log.requestPath}
                </Code>
              </Flex>
            ))
          )}
        </Card>
        <Flex align="center">
          <Button disabled={page === 0} m="md" ml={0} onClick={prevPage}>
            <IconArrowLeft />
          </Button>
          <Text>Page {page + 1}</Text>
          <Button m="md" onClick={nextPage}>
            <IconArrowRight />
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
