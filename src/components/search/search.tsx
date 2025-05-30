import { Popover } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { useQuoteSearch } from '../../hooks/useQuoteSearch';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

interface SearchProps {
  value?: string;
  onChange: (value: string) => void;
}

export const Search = ({ value, onChange }: SearchProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { results, loading, fetchMore } = useQuoteSearch({ term: value ?? '' });

  useEffect(() => {
    setSearchFocused(!!value);
  }, [value]);

  const resultsRef = useClickOutside(() => setSearchFocused(false));

  return (
    <Popover opened={searchFocused && !!value && value.length > 0} shadow="lg">
      <Popover.Target>
        <SearchInput
          value={value ?? ''}
          onChange={onChange}
          loading={loading}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </Popover.Target>
      <Popover.Dropdown sx={{ viewTransitionName: 'search-results' }}>
        <SearchResults
          ref={resultsRef}
          term={value}
          loading={loading}
          results={results}
          onNext={fetchMore}
          onClick={() => setSearchFocused(false)}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
