import { Box, Divider } from '@mantine/core';
import { GeneratorPanel } from '../components/generator/generator-panel';
import { Search } from '../components/search/search';
import { Stats } from '../components/stats';
import { useGenerationOptions } from '../hooks/useGenerationOptions';

import { OptionsContext } from '../hooks/useOptionsContext';
import { useState } from 'react';
import { ClipSuggestion } from '../components/clip-suggestion';

export default () => {
  const generation = useGenerationOptions();

  const [searchValue, setSearchValue] = useState<string>();

  return (
    <OptionsContext.Provider value={generation}>
      <Search value={searchValue} onChange={setSearchValue} />
      {generation.options.begin && generation.options.end ? (
        <GeneratorPanel />
      ) : (
        <Box mx="auto" m="xl" maw={900} ta="center">
          <ClipSuggestion setSearchValue={setSearchValue} />
          <Divider my="xl" />
          <Stats />
        </Box>
      )}
    </OptionsContext.Provider>
  );
};
