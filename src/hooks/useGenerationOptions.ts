import { useCallback, useRef } from 'react';
import { TransformMap, useQueryParams } from './useQueryParams';
import { withTransition } from '../util/with-transition';

export interface GenerationOptions {
  begin?: number;
  end?: number;
  filetype?: 'mp4' | 'gif';
  offset?: number;
  extend?: number;
  resolution?: number;
  subtitles?: boolean;
  substitutions?: string;
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
  substitutions: (v) => (v.length > 0 && v !== 'undefined' ? v : undefined),
};

export type GenerationOptionSetter = <T extends keyof GenerationOptions>(
  key: T,
  value: GenerationOptions[T]
) => void;

const defaultOptions = {
  filetype: 'gif',
  subtitles: true,
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
  if (!options.subtitles) delete out.subtitles;
  if (options.offset === 0) delete out.offset;
  if (options.extend === 0) delete out.extend;

  return out;
};

export const useGenerationOptions = () => {
  const [options, setOptionState] = useQueryParams<GenerationOptions>(
    defaultOptions,
    transform
  );

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const setOption = useCallback(
    <T extends keyof GenerationOptions>(
      key: T,
      value: GenerationOptions[T]
    ) => {
      const out = { ...optionsRef.current, [key]: value };

      // enable/disable subtitles if the user
      // switches to gif/mp4 respectively
      if (key === 'filetype') {
        out.subtitles = value !== 'mp4';
      }

      return setOptionState(validate(out));
    },
    [setOptionState]
  );

  const setOptions = useCallback(
    (options: Partial<GenerationOptions>) => {
      const out = { ...optionsRef.current, ...options };

      // enable/disable subtitles if the user
      // switches to gif/mp4 respectively
      if (options.filetype) {
        out.subtitles = options.filetype !== 'mp4';
      }

      return setOptionState(validate(out));
    },
    [setOptionState]
  );

  const setRange = useCallback(
    (begin: number, end: number) =>
      // reset all options when entire range changes
      // because it defaults to gif, enable subtitles
      setOptionState(validate({ ...defaultOptions, begin, end })),
    [setOption]
  );

  return {
    options,
    setOption,
    setOptions,
    setRange,
    setOptionWithTransition: withTransition(setOption),
    setOptionsWithTransition: withTransition(setOptions),
    setRangeWithTransition: withTransition(setRange),
  };
};
