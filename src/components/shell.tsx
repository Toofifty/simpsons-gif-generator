import {
  ActionIcon,
  Anchor,
  AppShell,
  Flex,
  Header,
  Image,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ReactNode } from 'react';
import Logo from '../assets/logo.png';

export const Shell = ({ children }: { children: ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

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
                  : theme.colors.gray[3],
            },
          })}
        >
          <Flex gap="xl" justify="space-between" align="center">
            <Image src={Logo} width="60" />
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
          </Flex>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};
