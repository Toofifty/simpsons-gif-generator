import {
  ActionIcon,
  Anchor,
  AppShell,
  Flex,
  Header,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ReactNode } from 'react';

export const Shell = ({ children }: { children: ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const theme = useMantineTheme();

  return (
    <AppShell
      header={
        <Header
          height={64}
          p="lg"
          withBorder={false}
          styles={(theme) => ({
            root: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          <Flex gap="xl" justify="flex-end" align="center">
            <Anchor
              href="https://github.com/toofifty/simpsons-gif-generator"
              color="gray"
            >
              Source
            </Anchor>
            <Anchor
              href="https://github.com/toofifty/simpsons-api"
              color="gray"
            >
              API
            </Anchor>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? (
                <IconSun size="1.1rem" />
              ) : (
                <IconMoonStars size="1.1rem" />
              )}
            </ActionIcon>
          </Flex>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};
