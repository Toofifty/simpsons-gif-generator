import {
  ActionIcon,
  Anchor,
  AppShell,
  Button,
  Flex,
  Header,
  Image,
  Text,
  UnstyledButton,
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

  const scrolled = scroll.y > 0;

  return (
    <AppShell
      header={
        <Header
          height={96}
          p="lg"
          withBorder={scrolled}
          styles={(theme) => ({
            root: {
              height: scrolled ? 64 : 96,
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? scrolled
                    ? theme.colors.dark[7]
                    : theme.colors.dark[5]
                  : scrolled
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
              paddingLeft: scroll.y > 0 ? 0 : theme.spacing.xl,
              paddingRight: scroll.y > 0 ? 0 : theme.spacing.xl,
              transition: 'padding 0.2s',
            })}
          >
            <Flex gap="xl" align="center">
              <UnstyledButton
                component={NavLink}
                to="/"
                color="#ff0"
                fw="bold"
                viewTransition
              >
                <Flex gap="sm" align="center">
                  <Image src={Logo} width="60" />
                  <Text
                    sx={() => ({
                      color: '#ff0',
                      WebkitFontSmoothing: 'antialiased',
                      textShadow: '0 0 1px #000,'.repeat(20).replace(/,$/, ''),
                    })}
                  >
                    Linguo
                  </Text>
                </Flex>
              </UnstyledButton>
              <Button
                variant="default"
                component={NavLink}
                to="/browse/recent"
                viewTransition
                radius="lg"
              >
                Browse
              </Button>
            </Flex>
            <Flex gap="xs" justify="flex-end" align="center">
              {!isMobile && (
                <>
                  <Button
                    variant="default"
                    component="a"
                    href="https://github.com/toofifty/simpsons-gif-generator"
                    radius="lg"
                  >
                    Source
                  </Button>
                  <Button
                    variant="default"
                    component="a"
                    href="https://github.com/toofifty/simpsons-api"
                    radius="lg"
                  >
                    API
                  </Button>
                </>
              )}
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
                size={scrolled ? 'lg' : 'xl'}
                radius="lg"
              >
                {dark ? (
                  <IconSun size="1.2rem" />
                ) : (
                  <IconMoonStars size="1.2rem" />
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
