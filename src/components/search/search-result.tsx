import {
  Box,
  Card,
  Divider,
  Flex,
  Image,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { MetaBundle, Subtitle } from '../../api';
import { episodeIdentifier } from '../../utils';

interface SearchResultProps {
  result: {
    meta: MetaBundle;
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
    thumbnail: string;
  };
  first?: boolean;
}

export const SearchResult = ({ result, first }: SearchResultProps) => {
  const { setRange } = useOptionsContext();

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const episode = episodeIdentifier(result.meta);

  const thumbnail = (
    <Card withBorder shadow="sm" p="0" radius="md" style={{ borderWidth: 2 }}>
      <Image src={result.thumbnail} radius="sm" />
    </Card>
  );

  const quote = (
    <Text>
      {result.before.map((line) => (
        <Text key={line.id} color="dimmed">
          {line.text}
        </Text>
      ))}
      {result.lines.map((line) => (
        <Text
          key={line.id}
          color={theme.colorScheme === 'dark' ? 'white' : undefined}
        >
          {line.text}
        </Text>
      ))}
      {result.after.map((line) => (
        <Text key={line.id} color="dimmed">
          {line.text}
        </Text>
      ))}
    </Text>
  );

  const details = (
    <Text size="xs" color="dimmed" ta={isMobile ? 'left' : 'right'}>
      <Text>{episode}</Text>
      <Text maw={300}>{result.meta.episode_title}</Text>
    </Text>
  );

  return (
    <>
      {!first && isMobile && <Divider />}
      <UnstyledButton
        w={isMobile || isTablet ? 'calc(100vw - 4rem)' : 'calc(900px - 4rem)'}
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
          align={isMobile ? 'stretch' : 'center'}
          justify="flex-start"
          gap="lg"
          direction={isMobile ? 'column' : undefined}
        >
          {!isMobile && thumbnail}
          <Flex
            align={isMobile ? 'stretch' : 'center'}
            justify="space-between"
            direction={isMobile ? 'column' : undefined}
            sx={{ flex: 1 }}
          >
            {quote}
            {isMobile ? (
              <Flex align="center" gap="lg" justify="space-between">
                {details}
                {thumbnail}
              </Flex>
            ) : (
              details
            )}
          </Flex>
        </Flex>
      </UnstyledButton>
    </>
  );
};
