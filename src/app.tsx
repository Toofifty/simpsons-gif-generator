import { useEffect, useState } from 'react';
import {
  Box,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Text,
} from '@mantine/core';
import { Shell } from './components/shell';
import { Generator } from './components/generator/generator';
import { useDebouncedState } from '@mantine/hooks';
import { Search } from './components/search/search';
import { randomQuote } from './random-quote';

export const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const [range, setRange] = useState<[number, number]>();

  useEffect(() => {
    if (range && range[0] > range[1]) {
      setRange([range[1], range[0]]);
    }
  }, [range]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Lexend Deca, sans-serif',
          colorScheme,
          globalStyles: (theme) => ({
            body: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          }),
        }}
      >
        <Shell>
          <Search setRange={(begin, end) => setRange([begin, end])} />
          {range ? (
            <Generator
              begin={range[0]}
              end={range[1]}
              setRange={(begin, end) => setRange([begin, end])}
            />
          ) : (
            <Box mx="auto" m="xl" maw={600}>
              <Text ta="center" color="gray">
                Start searching for a quote, like:
              </Text>
              <Text ta="center" mt="lg" size="lg" italic>
                {randomQuote()}
              </Text>
            </Box>
          )}
        </Shell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
