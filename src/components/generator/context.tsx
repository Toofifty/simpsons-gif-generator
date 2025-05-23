import {
  ActionIcon,
  SpacingValue,
  Stack,
  SystemProp,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { QuoteContextResponseData } from '../../api';
import { isValid } from '../../hooks/useGenerationOptions';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { assert } from '../../utils';
import { SliderOption } from '../vertical-slider/slider-option';
import { VerticalSlider } from '../vertical-slider/vertical-slider';
import { useEffect, useState } from 'react';
import { IconX } from '@tabler/icons-react';

interface ContextProps {
  context: QuoteContextResponseData;
  ml?: SystemProp<SpacingValue>;
}

export const Context = ({ context, ml }: ContextProps) => {
  const { options, setOption } = useOptionsContext();
  assert(isValid(options));

  const [substitutions, setSubstitutions] = useState<Record<number, string>>(
    {}
  );

  const firstRenderedId = context.matches.before[0]!.id;

  useEffect(() => {
    if (Object.keys(substitutions).length > 0) {
      setOption(
        'substitutions',
        Object.entries(substitutions)
          .reduce((acc, [id, sub]) => {
            acc[Number(id) - options.begin] = sub;
            return acc;
          }, Array(options.end - options.begin).fill('~'))
          .map((v) => (typeof v ? `"${v}"` : '~'))
          .join(',')
      );
    } else {
      setOption('substitutions', undefined);
    }
  }, [substitutions, options.begin]);

  useEffect(() => {
    setSubstitutions([]);
  }, [context.meta.episode_title]);

  const lines = [
    ...context.matches.before,
    ...context.matches.lines,
    ...context.matches.after,
  ];

  return (
    <Stack
      ml={ml}
      sx={{
        maxHeight: '100%',
        overflow: 'auto',
        flex: 1,
      }}
    >
      <VerticalSlider
        startIndex={options.begin - firstRenderedId}
        endIndex={options.end - firstRenderedId}
        setRange={(startIndex, endIndex) => {
          if (options.begin - firstRenderedId !== startIndex) {
            setOption('begin', startIndex + firstRenderedId);
          }

          if (options.end - firstRenderedId !== endIndex) {
            setOption('end', endIndex + firstRenderedId);
          }
        }}
      >
        {lines.map(({ id, text }) => (
          <SliderOption
            key={id}
            active={id >= options.begin && id < options.end}
          >
            <Textarea
              autosize
              value={substitutions[id] ?? text.trim().replace('\n', ' ')}
              variant="filled"
              disabled={id < options.begin || id > options.end}
              onChange={(e) => {
                setSubstitutions((subs) => ({
                  ...subs,
                  [id]: e.target.value === text ? '~' : e.target.value,
                }));
              }}
              rightSection={
                substitutions[id] ? (
                  <Tooltip label="Reset custom text">
                    <ActionIcon
                      onClick={() => {
                        setSubstitutions((subs) => {
                          const copy = { ...subs };
                          delete copy[id];
                          return copy;
                        });
                      }}
                    >
                      <IconX size="14" />
                    </ActionIcon>
                  </Tooltip>
                ) : undefined
              }
            />
          </SliderOption>
        ))}
      </VerticalSlider>
    </Stack>
  );
};
