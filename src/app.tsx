import { useState } from 'react';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { Shell } from './components/shell';
import { Notifications } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { ViewTransition } from './components/view-transition';

export const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

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
                  : theme.colors.gray[0],
            },
          }),
        }}
      >
        <Notifications />
        <Shell>
          <ViewTransition>
            <Outlet />
          </ViewTransition>
        </Shell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
