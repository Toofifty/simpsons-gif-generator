import { Box } from '@mantine/core';
import { ReactNode } from 'react';
import { Bullet } from './bullet';

interface BoxWithLineProps {
  active: boolean;
  children: ReactNode;
}

const BoxWithLine = ({ active, children }: BoxWithLineProps) => (
  <Box
    sx={(theme) => ({
      position: 'relative',
      boxSizing: 'border-box',
      paddingLeft: '1.5rem',
      marginLeft: '1rem',
      '::before': {
        content: '""',
        display: 'block',
        boxSizing: 'border-box',
        position: 'absolute',
        backgroundColor: active
          ? theme.colors.blue[6]
          : theme.colorScheme === 'dark'
          ? theme.colors.gray[7]
          : theme.colors.gray[4],
        width: '0.5rem',
        height: 'calc(100% + 1rem)',
        left: '-0.375rem',
        top: '0.45rem',
      },
      '&:first-of-type::before': {
        borderTopLeftRadius: '0.25rem',
        borderTopRightRadius: '0.25rem',
      },
      '&:last-of-type::before': {
        borderBottomLeftRadius: '0.25rem',
        borderBottomRightRadius: '0.25rem',
        height: '0.6rem',
      },
    })}
  >
    {children}
  </Box>
);

interface SliderOptionProps {
  children: ReactNode;
  active: boolean;
}

export const SliderOption = ({ children, active }: SliderOptionProps) => {
  return (
    <BoxWithLine active={active}>
      <Bullet />
      {children}
    </BoxWithLine>
  );
};
