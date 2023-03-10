import { Box } from '@mantine/core';

interface HandleProps {
  translateY: number;
}

export const Handle = ({ translateY }: HandleProps) => (
  <Box
    sx={(theme) => ({
      boxSizing: 'border-box',
      cursor: 'pointer',
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '2rem',
      boxShadow: theme.shadows.md,
      border: `.25rem solid ${
        theme.colorScheme === 'dark' ? theme.white : theme.colors.blue[6]
      }`,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.blue[6] : theme.white,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translateY(${translateY}px)`,
    })}
  />
);
