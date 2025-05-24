import { Transition } from '@mantine/core';
import { useEffect, useId, useState } from 'react';

class Queue {
  private queue: [string, () => void][] = [];
  private processing: boolean = false;
  delay: number = 25;

  enqueue(key: string, callback: () => void) {
    if (this.queue.some(([k]) => k === key)) {
      return;
    }
    this.queue.push([key, callback]);
    this.processQueue();
  }

  dequeue(key: string) {
    const index = this.queue.findIndex(([k]) => k === key);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const [, callback] = this.queue[0];
      callback();
      this.queue.shift();
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
    this.processing = false;
  }
}
const queue = new Queue();

interface SlideInTransitionProps {
  children: (styles: React.CSSProperties) => React.ReactElement<any, any>;
  skip?: boolean;
}

export const SlideInTransitionCSS = () => (
  <style>
    {`
        @keyframes slide-in {
          from {
            transform: translateY(5%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
          `}
  </style>
);

export const SlideInTransition = ({
  children,
  skip,
}: SlideInTransitionProps) => {
  const key = useId();
  const [style, setStyle] = useState<React.CSSProperties>(() =>
    skip ? {} : { opacity: 0 }
  );

  useEffect(() => {
    queue.enqueue(key, () => {
      setStyle({ animation: `slide-in 250ms` });
    });

    return () => {
      queue.dequeue(key);
    };
  }, [key]);

  useEffect(() => {
    if (skip) {
      queue.dequeue(key);
      setStyle({});
    }
  }, [skip, key]);

  return children(style);
};
