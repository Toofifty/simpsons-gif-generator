import { useEffect, useState } from 'react';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { Shell } from './components/shell';
import { Root } from './root';
import { Notifications } from '@mantine/notifications';

export const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
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
                  : theme.colors.gray[3],
            },
          }),
        }}
      >
        <Notifications />
        <Shell>
          <Root range={range} setRange={setRange} />
        </Shell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
