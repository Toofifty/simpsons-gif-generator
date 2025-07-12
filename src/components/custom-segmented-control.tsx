import {
  Button,
  DefaultMantineColor,
  Flex,
  MantineStyleSystemProps,
  Paper,
  SegmentedControlItem,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';

interface CustomSegmentedControlProps extends MantineStyleSystemProps {
  color?: DefaultMantineColor;
  label?: string;
  data: SegmentedControlItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export const CustomSegmentedControl = ({
  color = 'blue',
  label,
  data,
  value,
  onChange,
  ...styleProps
}: CustomSegmentedControlProps) => {
  const { colorScheme } = useMantineColorScheme();

  const indicatorRef = useRef<HTMLDivElement>(undefined!);
  const [activeButtonRef, setActiveButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const previousActiveButtonRef = usePrevious(activeButtonRef);

  const updateIndicator = (event?: UIEvent) => {
    if (!activeButtonRef) {
      return;
    }

    indicatorRef.current.style.transition =
      !event && previousActiveButtonRef ? '250ms ease-in-out' : '';

    indicatorRef.current.style.left = `${activeButtonRef.offsetLeft}px`;
    indicatorRef.current.style.top = `${activeButtonRef.offsetTop}px`;
    indicatorRef.current.style.width = `${activeButtonRef.offsetWidth}px`;
    indicatorRef.current.style.height = `${activeButtonRef.offsetHeight}px`;
  };

  useEffect(() => {
    updateIndicator();

    setTimeout(updateIndicator, 10);

    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeButtonRef]);

  return (
    <Paper
      radius="0.85rem"
      py="0.2rem"
      px="0.25rem"
      pos="relative"
      withBorder
      bg={colorScheme === 'dark' ? 'dark.7' : 'gray.1'}
      sx={(theme) => ({
        boxShadow:
          colorScheme === 'dark'
            ? `inset ${theme.shadows.xs.replace('),', '), inset')}`
            : undefined,
        overflowX: 'auto',
      })}
      {...styleProps}
    >
      <Flex gap="0.4rem" justify="stretch" align="stretch">
        {label && (
          <Paper
            radius="0.6rem"
            px="xs"
            py="0.1rem"
            bg={colorScheme === 'dark' ? 'dark.5' : 'white'}
            withBorder
          >
            <Text
              size="sm"
              h="100%"
              align="center"
              p="0.3rem"
              style={{ whiteSpace: 'nowrap' }}
            >
              {label}
            </Text>
          </Paper>
        )}
        {data.map((item, i) => (
          <Button
            key={i}
            ref={item.value === value ? setActiveButtonRef : undefined}
            radius="0.6rem"
            color={color}
            variant={item.value === value ? 'filled' : 'transparent'}
            fw={item.value === value ? undefined : 'normal'}
            size="sm"
            onClick={() => onChange?.(item.value)}
            sx={{
              zIndex: 2,
              flex: 1,
              ...(item.value === value
                ? { background: 'transparent !important' }
                : { border: '1px solid transparent' }),
            }}
          >
            {item.label}
          </Button>
        ))}
      </Flex>
      <Paper
        ref={indicatorRef}
        shadow="lg"
        bg={color}
        w="100px"
        h="40px"
        sx={{
          position: 'absolute',
          borderRadius: '0.6rem',
          zIndex: 0,
          top: 0,
          width: 0,
          height: 0,
        }}
      />
    </Paper>
  );
};
