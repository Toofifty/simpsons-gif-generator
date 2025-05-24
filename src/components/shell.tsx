import {
  ActionIcon,
  Anchor,
  AppShell,
  Flex,
  Header,
  Image,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';

export const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [scroll] = useWindowScroll();

  return (
    <AppShell
      header={
        <Header
          height={96}
          p="lg"
          withBorder={scroll.y > 0}
          styles={(theme) => ({
            root: {
              height: scroll.y > 0 ? 64 : 96,
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? scroll.y > 0
                    ? theme.colors.dark[7]
                    : theme.colors.dark[5]
                  : scroll.y > 0
                  ? theme.white
                  : theme.colors.gray[0],
              zIndex: 300,
              transition: 'background-color 0.2s, height 0.2s',
            },
          })}
        >
          <Flex
            h="100%"
            gap="xl"
            justify="space-between"
            align="center"
            sx={(theme) => ({
              paddingLeft: scroll.y > 0 || isMobile ? 0 : theme.spacing.xl,
              paddingRight: scroll.y > 0 || isMobile ? 0 : theme.spacing.xl,
              transition: 'padding 0.2s',
            })}
          >
            <Flex gap="xl">
              <Anchor
                component={NavLink}
                to="/"
                color="#ff0"
                fw="bold"
                viewTransition
              >
                <Flex gap="sm">
                  <Image src={Logo} width="60" />
                  <Text
                    sx={() => ({
                      WebkitFontSmoothing: 'antialiased',
                      textShadow: '0 0 1px #000,'.repeat(20).replace(/,$/, ''),
                    })}
                  >
                    Linguo
                  </Text>
                </Flex>
              </Anchor>
              <Anchor
                component={NavLink}
                to="/generate"
                color="gray"
                viewTransition
              >
                Generate
              </Anchor>
              <Anchor
                component={NavLink}
                to="/browse/recent"
                color="gray"
                viewTransition
              >
                Browse
              </Anchor>
            </Flex>
            <Flex gap="xl" justify="flex-end" align="center">
              {!isMobile && (
                <>
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
                </>
              )}
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
