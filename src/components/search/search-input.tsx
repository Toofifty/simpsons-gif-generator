import { ActionIcon, Box, Loader, TextInput } from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ForwardedRef, forwardRef, useRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  loading?: boolean;
}

export const SearchInput = forwardRef(
  (
    { value, onChange, onFocus, onBlur, loading }: SearchInputProps,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useMergedRef(inputRef, forwardedRef);

    return (
      <Box mx="auto" maw={800}>
        <TextInput
          ref={ref}
          size="lg"
          mx="lg"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          icon={loading ? <Loader color="gray" size="xs" /> : <IconSearch />}
          rightSection={
            value ? (
              <ActionIcon
                onClick={() => {
                  onChange('');
                  inputRef.current?.focus();
                }}
              >
                <IconX />
              </ActionIcon>
            ) : undefined
          }
        />
      </Box>
    );
  }
);
