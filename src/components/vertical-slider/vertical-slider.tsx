import { Box, Stack } from '@mantine/core';
import { useMove } from '@mantine/hooks';
import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Handle } from './handle';

const getBullets = (ref: HTMLDivElement): HTMLElement[] =>
  Array.from(ref.querySelectorAll('.vs-bullet'));

const Hitbox = forwardRef(
  (
    { children }: { children: ReactNode },
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <Box
      component="span"
      ref={ref}
      sx={() => ({
        position: 'absolute',
        width: '1.5rem',
        height: '100%',
        left: '0.125rem',
        cursor: 'pointer',
      })}
    >
      {children}
    </Box>
  )
);

interface VerticalSliderProps {
  children: ReactNode;
  startIndex: number;
  endIndex: number;
  setRange: (startIndex: number, endIndex: number) => void;
  onDrop?: () => void;
}

export const VerticalSlider = ({
  children,
  startIndex,
  endIndex,
  setRange,
  onDrop,
}: VerticalSliderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState<number>();
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end'>();

  // trigger rerender on first load to move
  // handles to correct positions
  const [_, rerender] = useState(0);
  useEffect(() => {
    rerender((i) => i + 1);
  }, [startIndex, endIndex]);

  const { ref: hitboxRef, active: isDragging } = useMove(({ y }) =>
    setDragY(y * ref.current!.getBoundingClientRect().height)
  );

  const startY = (() => {
    if (!ref.current) return 0;
    const bullet = getBullets(ref.current)[startIndex];
    if (!bullet) return 0;
    const parent = bullet.offsetParent as HTMLElement;
    return parent?.offsetTop ?? 0;
  })();

  const endY = (() => {
    if (!ref.current) return 0;
    const bullet = getBullets(ref.current)[endIndex];
    if (!bullet) return 0;
    const parent = bullet.offsetParent as HTMLElement;
    return parent?.offsetTop ?? 0;
  })();

  useEffect(() => {
    if (isDragging && dragY !== undefined && !draggingHandle) {
      setDraggingHandle(
        Math.abs(startY - dragY) < Math.abs(endY - dragY) ? 'start' : 'end'
      );
    }
    if (!isDragging) {
      setDraggingHandle(undefined);
      setDragY(undefined);
      onDrop?.();
    }
  }, [isDragging, dragY, startY, endY]);

  useEffect(() => {
    if (draggingHandle && dragY) {
      const bullets = getBullets(ref.current!);
      // get index of bullet that is closest to the dragY
      const { index } = bullets.reduce(
        (acc, bullet, index) => {
          const parent = bullet.offsetParent as HTMLElement;
          const bulletY = parent.offsetTop;
          const distance = Math.abs(bulletY - dragY);
          if (distance < acc.distance) {
            return { index, distance };
          }
          return acc;
        },
        { index: 0, distance: Infinity }
      );
      setRange(
        draggingHandle === 'start' ? index : startIndex,
        draggingHandle === 'end' ? index : endIndex
      );
    }
  }, [draggingHandle, dragY]);

  return (
    <Stack ref={ref} pos="relative" style={{ gap: 2 }}>
      {children}
      <Hitbox ref={hitboxRef}>
        <Handle
          translateY={draggingHandle === 'start' ? dragY! - 12 : startY}
        />
        <Handle translateY={draggingHandle === 'end' ? dragY! - 12 : endY} />
      </Hitbox>
    </Stack>
  );
};
