import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type TransformMap<T> = {
  [K in keyof T]?: (value: string) => T[K];
};

export const useQueryParams = <T extends Record<string, any>>(
  initialValue: T,
  transform: TransformMap<T>
) => {
  const [searchParams, setSearchParams] = useSearchParams(initialValue);

  const value = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(Object.fromEntries(searchParams)).map(([k, v]) => [
          k,
          transform[k] ? transform[k]!(v) : v,
        ])
      ) as T,
    [searchParams]
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setSearchParams(typeof next === 'function' ? next(value) : next);
    },
    [value, setSearchParams]
  );

  return [value, setValue] as const;
};
