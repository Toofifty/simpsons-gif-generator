import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { GeneratorPanel } from '../components/generator/generator-panel';
import { Search } from '../components/search/search';
import { Stats } from '../components/stats';
import { useGenerationOptions } from '../hooks/useGenerationOptions';

import { OptionsContext } from '../hooks/useOptionsContext';
import { useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { useRandomQuote } from '../hooks/useRandomQuote';
import { useMediaQuery } from '@mantine/hooks';

export default () => {
  const theme = useMantineTheme();
  const generation = useGenerationOptions();

  const [searchValue, setSearchValue] = useState<string>();

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { quote, snap, fetch: fetchRandom } = useRandomQuote();
  console.log(quote);

  return (
    <OptionsContext.Provider value={generation}>
      <Search value={searchValue} onChange={setSearchValue} />
      {generation.options.begin && generation.options.end ? (
        <GeneratorPanel />
      ) : (
        <Box mx="auto" m="xl" maw={900} ta="center">
          <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
            Start searching for a quote, like:
          </Text>
          <Flex justify="center" align="center">
            <UnstyledButton
              onClick={() => setSearchValue(quote?.join(' '))}
              px="sm"
              sx={(theme) => ({
                borderRadius: theme.radius.sm,
                ':hover': {
                  color:
                    theme.colorScheme === 'dark'
                      ? 'white'
                      : theme.colors.gray[8],
                },
              })}
            >
              <Flex p="sm" direction={isMobile ? 'column' : undefined}>
                {snap && (
                  <Image
                    height={90}
                    width={120}
                    src={snap}
                    radius="sm"
                    mr="lg"
                  />
                )}
                <Text m="lg" mt="sm" size="lg" italic>
                  {quote?.map((line, i) => {
                    return (
                      <>
                        {line}
                        {i - 1 !== quote.length ? <br /> : null}
                      </>
                    );
                  })}
                </Text>
              </Flex>
            </UnstyledButton>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="xl"
              onClick={() => fetchRandom()}
            >
              <IconRefresh size="1.2rem" />
            </ActionIcon>
          </Flex>
          <Divider mb="xl" />
          <Stats />
        </Box>
      )}
    </OptionsContext.Provider>
  );
};
