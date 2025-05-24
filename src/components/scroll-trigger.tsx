import { Box, MantineStyleSystemProps, Text } from '@mantine/core';
import { useEffect } from 'react';

interface ScrollTriggerProps {
  id: string;
  children: React.ReactNode;
  onIntersect?: () => void;
  offset?: MantineStyleSystemProps['mt'];
}

export const ScrollTrigger = ({
  id,
  children,
  onIntersect,
  offset = 0,
}: ScrollTriggerProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onIntersect?.();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(document.getElementById(id)!);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect]);

  return (
    <Text ta="center">
      <Box id={id} pos="absolute" mt={offset} w="10" h="10" />
      {children}
    </Text>
  );
};
