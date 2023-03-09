import { Popover } from '@mantine/core';
import { useState } from 'react';
import { useQuoteSearch } from '../../hooks/useQuoteSearch';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

interface SearchProps {
  setInitialRange: (begin: number, end: number) => void;
}

export const Search = ({ setInitialRange }: SearchProps) => {
  const [value, setValue] = useState<string>();
  const [searchFocused, setSearchFocused] = useState(false);
  const { results, loading } = useQuoteSearch({ term: value ?? '' });

  return (
    <Popover opened={searchFocused && !!value && value.length > 0} shadow="lg">
      <Popover.Target>
        <SearchInput
          value={value ?? ''}
          onChange={setValue}
          loading={loading}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <SearchResults
          term={value ?? ''}
          results={results}
          setRange={setInitialRange}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
