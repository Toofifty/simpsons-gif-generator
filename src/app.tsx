import { useState } from 'react';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Text,
} from '@mantine/core';
import { Shell } from './components/shell';
import { Generator } from './components/generator/generator';
import { useDebouncedState } from '@mantine/hooks';

export const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const [range, setRange] = useState([114906, 114917]);
  const [debouncedRange, setDebouncedRange] = useDebouncedState(range, 500);

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
          <Generator
            begin={range[0]}
            end={range[1]}
            setRange={(begin, end) => setRange([begin, end])}
          />
        </Shell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
