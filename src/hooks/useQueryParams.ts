import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type TransformMap<T> = {
  [K in keyof T]?: (value: string) => T[K];
};

const toObject = <T extends Record<string, any>>(
  params: URLSearchParams,
  transform: TransformMap<T>
) =>
  Object.fromEntries(
    Object.entries(Object.fromEntries(params)).map(([k, v]) => [
      k,
      transform[k] ? transform[k]!(v) : v,
    ])
  ) as T;

const withoutEmpties = <T extends Record<string, any>>(value: T) => {
  return Object.fromEntries(
    Object.entries(value).filter(([_, v]) => v !== undefined)
  );
};

export const useQueryParams = <T extends Record<string, any>>(
  initialValue: T,
  transform: TransformMap<T>
) => {
  const [searchParams, setSearchParams] = useSearchParams(initialValue);

  const value = useMemo(
    () => toObject<T>(searchParams, transform),
    [searchParams]
  );

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setSearchParams(
      typeof next === 'function'
        ? (prev) => next(toObject<T>(prev, transform))
        : new URLSearchParams(withoutEmpties(next)),
      { replace: true }
    );
  }, []);

  return [value, setValue] as const;
};
