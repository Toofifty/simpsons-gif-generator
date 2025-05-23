import { Flex } from '@mantine/core';

interface ViewTransitionProps {
  children: React.ReactNode;
}

export const ViewTransition = ({ children }: ViewTransitionProps) => {
  return (
    // <Flex sx={{ display: 'contents', viewTransitionName: 'content' }}>
    children
    // </Flex>
  );
};
