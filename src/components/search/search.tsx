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
  const [semanticSearch, setSemanticSearch] = useState(false);
  const { results, debouncing, loading, fetchMore } = useQuoteSearch({
    term: value ?? '',
    semanticSearch,
  });

  useEffect(() => {
    setSearchFocused(!!value);
  }, [value, semanticSearch]);

  const resultsRef = useClickOutside(() => setSearchFocused(false));

  return (
    <Popover
      opened={searchFocused && !!value && value.length > 0}
      shadow="lg"
      radius="lg"
    >
      <Popover.Target>
        <SearchInput
          value={value ?? ''}
          onChange={onChange}
          debouncing={debouncing}
          loading={loading}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          semanticSearch={semanticSearch}
          setSemanticSearch={setSemanticSearch}
        />
      </Popover.Target>
      <Popover.Dropdown sx={{ viewTransitionName: 'search-results' }} p="md">
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
