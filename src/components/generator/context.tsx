import {
  ActionIcon,
  Flex,
  Skeleton,
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
import { scrollbarStyle } from '../../util/scrollbar-style';

interface ContextProps {
  context: QuoteContextResponseData;
  ml?: SystemProp<SpacingValue>;
}

export const Context = ({ context, ml }: ContextProps) => {
  const { options, setOption, setOptions } = useOptionsContext();
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

  const [localRange, setLocalRange] = useState(() => ({
    begin: options.begin,
    end: options.end,
  }));

  useEffect(() => {
    setLocalRange({
      begin: options.begin,
      end: options.end,
    });
  }, [options.begin, options.end]);

  return (
    <Stack
      ml={ml}
      sx={(theme) => ({
        maxHeight: '100%',
        overflow: 'auto',
        flex: 1,
        ...scrollbarStyle(theme),
      })}
    >
      <VerticalSlider
        startIndex={localRange.begin - firstRenderedId}
        endIndex={localRange.end - firstRenderedId}
        setRange={(startIndex, endIndex) => {
          setLocalRange((r) => {
            const newRange = { ...r };

            if (r.begin - firstRenderedId !== startIndex) {
              newRange.begin = startIndex + firstRenderedId;
            }

            if (r.end - firstRenderedId !== endIndex) {
              newRange.end = endIndex + firstRenderedId;
            }

            if (newRange.begin !== r.begin && newRange.begin > newRange.end) {
              newRange.end = newRange.begin;
            }

            if (newRange.end !== r.end && newRange.end < newRange.begin) {
              newRange.begin = newRange.end;
            }

            return newRange;
          });
        }}
        onDrop={() => {
          setOptions(localRange);
        }}
      >
        {lines.map(({ id, text }) => {
          const active = id >= localRange.begin && id <= localRange.end;
          const firstActive = id === localRange.begin;
          const lastActive = id === localRange.end;

          return (
            <SliderOption key={id} active={active && id < localRange.end}>
              <Textarea
                autosize
                styles={(theme) => ({
                  root: {
                    paddingBottom: 0,
                  },
                  input: {
                    border: 'none',
                    lineHeight: 1.5,
                    padding: theme.spacing.md,
                    borderTopLeftRadius: firstActive ? theme.radius.lg : 0,
                    borderTopRightRadius: firstActive ? theme.radius.lg : 0,
                    borderBottomLeftRadius: lastActive ? theme.radius.lg : 0,
                    borderBottomRightRadius: lastActive ? theme.radius.lg : 0,
                    background: active ? undefined : 'transparent !important',
                  },
                })}
                value={substitutions[id] ?? text.trim().replace('\n', ' ')}
                variant={active ? 'filled' : 'default'}
                disabled={!active}
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
          );
        })}
      </VerticalSlider>
    </Stack>
  );
};

export const ContextPlaceholder = ({
  ml,
}: {
  ml?: SystemProp<SpacingValue>;
}) => (
  <Flex gap="xs" w="100%" h="100%" ml={ml}>
    <Skeleton w={12} m="xs" radius="lg" />
    <Stack spacing="2px" sx={{ flexGrow: 1 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <Skeleton
          key={i}
          height={i % 2 === 0 ? 40 : 60}
          width="100%"
          radius="md"
          opacity={i >= 4 && i <= 7 ? 1 : 0.5}
        />
      ))}
    </Stack>
  </Flex>
);
