import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Image,
  Loader,
  Paper,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useRandomClip } from '../hooks/useRandomClip';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { Fragment } from 'react';

interface ClipSuggestionProps {
  setSearchValue: (value?: string) => void;
}

export const ClipSuggestion = ({ setSearchValue }: ClipSuggestionProps) => {
  const theme = useMantineTheme();

  const { quote, clip, fetch: fetchRandom, loading } = useRandomClip();

  return (
    <Flex direction="column" align="center">
      <Flex justify="center" align="center" gap="sm">
        <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
          Start searching for a quote, like:
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="xl"
          onClick={() => fetchRandom()}
        >
          <IconRefresh size="1.2rem" />
        </ActionIcon>
      </Flex>
      <Paper
        shadow="md"
        radius="sm"
        p="lg"
        m="lg"
        w="max-content"
        maw="calc(100% - 2rem)"
      >
        {loading ? (
          <Loader color="gray" m="xl" />
        ) : (
          <Flex direction="column" align="center" gap="lg">
            <Flex justify="center" align="center">
              <UnstyledButton
                onClick={() => setSearchValue(quote?.join(' '))}
                px="sm"
                sx={(theme) => ({
                  borderRadius: theme.radius.sm,
                  ':hover': {
                    color:
                      theme.colorScheme === 'dark'
                        ? 'white'
                        : theme.colors.gray[8],
                  },
                })}
              >
                <Flex align="center" gap="lg">
                  <IconSearch size="1.2rem" />
                  <Text size="lg" italic>
                    {quote?.map((line, i) => {
                      return (
                        <Fragment key={i}>
                          {line}
                          {i - 1 !== quote.length ? <br /> : null}
                        </Fragment>
                      );
                    })}
                  </Text>
                </Flex>
              </UnstyledButton>
            </Flex>
            <Divider w="100%" />
            {clip && (
              <Image height={180} width={240} src={clip.url} radius="sm" />
            )}
          </Flex>
        )}
      </Paper>
    </Flex>
  );
};
