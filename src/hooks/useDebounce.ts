import { useEffect, useRef, useState } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;

export const useDebounce = <Func extends SomeFunction>(
  func: Func,
  delay = 1000
) => {
  const timer = useRef<Timer>();
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    setIsDebouncing(true);
    const newTimer = setTimeout(() => {
      func(...args);
      setIsDebouncing(false);
    }, delay);
    clearTimeout(timer.current);
    timer.current = newTimer;
  }) as Func;

  return [debouncedFunction, isDebouncing] as const;
};
