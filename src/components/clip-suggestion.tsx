import {
  ActionIcon,
  AspectRatio,
  Box,
  Divider,
  Flex,
  Image,
  Loader,
  Paper,
  Text,
  UnstyledButton,
  useMantineColorScheme,
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
  const { colorScheme } = useMantineColorScheme();

  const { quote, clip, fetch: fetchRandom, loading } = useRandomClip();

  return (
    <Flex direction="column" align="center">
      <Flex justify="start" align="center" gap="sm">
        <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
          Start searching for a quote, like:
        </Text>
        <ActionIcon variant="subtle" size="xl" onClick={() => fetchRandom()}>
          {loading ? (
            <Loader
              color={colorScheme === 'dark' ? 'white' : 'gray'}
              size="xs"
            />
          ) : (
            <IconRefresh size="1.2rem" />
          )}
        </ActionIcon>
      </Flex>
      <Paper
        shadow="md"
        radius="md"
        p="md"
        m="lg"
        w="calc(360px + 2rem)"
        maw="calc(100% - 2rem)"
        opacity={loading ? 0.9 : 1}
        sx={{ viewTransitionName: 'clip-suggestion' }}
      >
        {!quote ? (
          <Loader color="gray" m="xl" />
        ) : (
          <Flex direction="column" align="center" gap="lg">
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
              <Flex justify="start" align="center" gap="lg">
                <IconSearch
                  size="1.2rem"
                  style={{ viewTransitionName: 'clip-suggestion-icon' }}
                />
                <Text size="md" italic>
                  {quote?.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i - 1 !== quote.length ? <br /> : null}
                    </Fragment>
                  ))}
                </Text>
              </Flex>
            </UnstyledButton>
            {clip && (
              <AspectRatio miw={360} ratio={4 / 3}>
                <Image
                  src={clip.url}
                  radius="sm"
                  sx={{ viewTransitionName: 'clip-suggestion-clip' }}
                />
              </AspectRatio>
            )}
          </Flex>
        )}
      </Paper>
    </Flex>
  );
};
