import { useCallback, useEffect } from 'react';
import { TransformMap, useQueryParams } from './useQueryParams';

export interface GenerationOptions {
  begin?: number;
  end?: number;
  filetype?: 'mp4' | 'gif';
  offset?: number;
  extend?: number;
  resolution?: number;
  subtitles?: boolean;
}

export interface ValidGenerationOptions extends GenerationOptions {
  begin: number;
  end: number;
}

export const isValid = (
  options: GenerationOptions
): options is ValidGenerationOptions =>
  options.begin !== undefined && options.end !== undefined;

const transform: TransformMap<GenerationOptions> = {
  begin: Number,
  end: Number,
  offset: (v) => (v ? Number(v) : undefined),
  extend: (v) => (v ? Number(v) : undefined),
  resolution: (v) => (v ? Number(v) : undefined),
  subtitles: (v) => (v ? v === 'true' : undefined),
};

export type GenerationOptionSetter = <T extends keyof GenerationOptions>(
  key: T,
  value: GenerationOptions[T]
) => void;

const defaultOptions = {
  filetype: 'gif',
} as const;

const validate = (options: GenerationOptions) => {
  const out = { ...options };

  // if the user selects a range in the wrong order,
  // we need to swap the values
  if ((options.begin ?? 0) > (options.end ?? 0)) {
    out.begin = options.end;
    out.end = options.begin;
  }

  // remove default values
  if (options.filetype === 'gif') delete out.filetype;
  if (options.subtitles) delete out.subtitles;
  if (options.offset === 0) delete out.offset;
  if (options.extend === 0) delete out.extend;

  return out;
};

export const useGenerationOptions = () => {
  const [options, setOptions] = useQueryParams<GenerationOptions>(
    defaultOptions,
    transform
  );

  const setOption = useCallback(
    <T extends keyof GenerationOptions>(key: T, value: GenerationOptions[T]) =>
      setOptions((options) => {
        const out = { ...options, [key]: value };

        // enable/disable subtitles if the user
        // switches to gif/mp4 respectively
        if (key === 'filetype') {
          out.subtitles = value === 'gif';
        }

        return validate(out);
      }),
    []
  );

  const setRange = useCallback(
    (begin: number, end: number) =>
      // reset all options when entire range changes
      setOptions(validate({ begin, end })),
    []
  );

  return {
    options,
    setOption,
    setRange,
  };
};