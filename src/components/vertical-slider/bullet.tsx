import { Box } from '@mantine/core';

export const Bullet = () => (
  <Box
    className="vs-bullet"
    sx={(theme) => ({
      boxSizing: 'border-box',
      width: '.25rem',
      height: '.25rem',
      borderRadius: '2rem',
      border: `.125rem solid ${theme.white}`,
      backgroundColor: theme.white,
      position: 'absolute',
      top: '.6rem',
      left: '-.25rem',
      right: 'auto',
    })}
  />
);
