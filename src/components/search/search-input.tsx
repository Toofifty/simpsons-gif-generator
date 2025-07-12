import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Loader,
  TextInput,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';
import {
  IconHourglass,
  IconSearch,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import { ForwardedRef, forwardRef, useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  debouncing?: boolean;
  loading?: boolean;
  semanticSearch?: boolean;
  setSemanticSearch: (value: boolean) => void;
}

export const SearchInput = forwardRef(
  (
    {
      value,
      onChange,
      onFocus,
      onBlur,
      debouncing,
      loading,
      semanticSearch,
      setSemanticSearch,
    }: SearchInputProps,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const { colorScheme } = useMantineColorScheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useMergedRef(inputRef, forwardedRef);

    return (
      <Box mx="auto" w="100%" maw={800}>
        <Flex gap="xs" align="center">
          <TextInput
            ref={ref}
            size="lg"
            radius="lg"
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            sx={{ flexGrow: 1 }}
            icon={
              loading ? (
                <Loader
                  color={colorScheme === 'dark' ? 'white' : 'gray'}
                  size="xs"
                />
              ) : debouncing ? (
                <IconHourglass />
              ) : (
                <IconSearch />
              )
            }
            rightSection={
              <Group align="center" noWrap>
                {value ? (
                  <ActionIcon
                    onClick={() => {
                      onChange('');
                      inputRef.current?.focus();
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                ) : undefined}
              </Group>
            }
          />
          <Group align="center">
            <Tooltip
              label={
                semanticSearch
                  ? 'Disable semantic search'
                  : 'Enable semantic search with AI'
              }
              radius="md"
            >
              <ActionIcon
                variant={semanticSearch ? 'gradient' : 'default'}
                color={semanticSearch ? 'blue' : undefined}
                onClick={() => setSemanticSearch(!semanticSearch)}
                radius="lg"
                size="xl"
              >
                <IconSparkles />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Flex>
      </Box>
    );
  }
);
