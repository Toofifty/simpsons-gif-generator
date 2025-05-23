import { Text } from '@mantine/core';
import { useEffect } from 'react';

interface ScrollTriggerProps {
  id: string;
  children: React.ReactNode;
  onIntersect?: () => void;
}

export const ScrollTrigger = ({
  id,
  children,
  onIntersect,
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
    <Text ta="center" id={id}>
      {children}
    </Text>
  );
};
