import { Box, Divider, Text, useMantineTheme } from '@mantine/core';
import { GeneratorPanel } from '../components/generator/generator-panel';
import { Search } from '../components/search/search';
import { Stats } from '../components/stats';
import { useGenerationOptions } from '../hooks/useGenerationOptions';
import { randomQuote } from '../random-quote';

import { OptionsContext } from '../hooks/useOptionsContext';

export default () => {
  const theme = useMantineTheme();
  const generation = useGenerationOptions();

  return (
    <OptionsContext.Provider value={generation}>
      <Search />
      {generation.options.begin && generation.options.end ? (
        <GeneratorPanel />
      ) : (
        <Box mx="auto" m="xl" maw={600} ta="center">
          <Text color={theme.colorScheme === 'dark' ? 'dark.2' : 'gray'}>
            Start searching for a quote, like:
          </Text>
          <Text mt="lg" size="lg" italic>
            {randomQuote()}
          </Text>
          <Divider my="xl" />
          <Stats />
        </Box>
      )}
    </OptionsContext.Provider>
  );
};
