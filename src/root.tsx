import { Box, Divider, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Generator } from './components/generator/generator';
import { Search } from './components/search/search';
import { Stats } from './components/stats';
import { randomQuote } from './random-quote';

interface RootProps {
  range?: [number, number];
  setRange: (range: [number, number]) => void;
}

export const Root = ({ range, setRange }: RootProps) => {
  const theme = useMantineTheme();

  return (
    <>
      <Search setRange={(begin, end) => setRange([begin, end])} />
      {range ? (
        <Generator
          begin={range[0]}
          end={range[1]}
          setRange={(begin, end) => setRange([begin, end])}
        />
      ) : (
        <Box mx="auto" m="xl" maw={600} ta="center">
          <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
            Start searching for a quote, like:
          </Text>
          <Text mt="lg" size="lg" italic>
            {randomQuote()}
          </Text>
          <Divider my="xl" />
          <Stats />
        </Box>
      )}
    </>
  );
};
