import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { GeneratorPanel } from '../components/generator/generator-panel';
import { Search } from '../components/search/search';
import { Stats } from '../components/stats';
import { useGenerationOptions } from '../hooks/useGenerationOptions';
import { randomQuote } from '../random-quote';

import { OptionsContext } from '../hooks/useOptionsContext';
import { useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';

export default () => {
  const theme = useMantineTheme();
  const generation = useGenerationOptions();

  const [searchValue, setSearchValue] = useState<string>();

  const [quote, setQuote] = useState(randomQuote);

  return (
    <OptionsContext.Provider value={generation}>
      <Search value={searchValue} onChange={setSearchValue} />
      {generation.options.begin && generation.options.end ? (
        <GeneratorPanel />
      ) : (
        <Box mx="auto" m="xl" maw={600} ta="center">
          <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
            Start searching for a quote, like:
          </Text>
          <Flex justify="center" align="center">
            <UnstyledButton
              onClick={() => setSearchValue(quote)}
              ta="center"
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
              <Text m="lg" size="lg" italic>
                "{quote}"
              </Text>
            </UnstyledButton>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="xl"
              onClick={() => setQuote(randomQuote())}
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
