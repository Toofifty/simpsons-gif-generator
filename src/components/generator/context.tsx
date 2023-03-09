import { ScrollArea, Stack, Text, useMantineTheme } from '@mantine/core';
import { QuoteContextResponseData } from '../../api';
import {
  isValid,
  useGenerationOptions,
} from '../../hooks/useGenerationOptions';
import { assert } from '../../utils';
import { SliderOption } from '../vertical-slider/slider-option';
import { VerticalSlider } from '../vertical-slider/vertical-slider';

interface ContextProps {
  context: QuoteContextResponseData;
}

export const Context = ({ context }: ContextProps) => {
  const { options, setRange } = useGenerationOptions();
  assert(isValid(options));

  const theme = useMantineTheme();

  const firstId = context.matches.before[0]!.id;

  const lines = [
    ...context.matches.before,
    ...context.matches.lines,
    ...context.matches.after,
  ];

  return (
    <Stack
      ml="lg"
      sx={() => ({
        maxHeight: '100%',
        overflow: 'auto',
        flex: 1,
      })}
    >
      <VerticalSlider
        startIndex={options.begin - firstId}
        endIndex={options.end - firstId}
        setRange={(startIndex, endIndex) =>
          setRange(startIndex + firstId, endIndex + firstId)
        }
      >
        {lines.map(({ id, text }) => (
          <SliderOption
            key={id}
            active={id >= options.begin && id < options.end}
          >
            <Text
              color={
                id >= options.begin && id <= options.end
                  ? theme.colorScheme === 'dark'
                    ? theme.white
                    : theme.black
                  : 'dimmed'
              }
            >
              {text}
            </Text>
          </SliderOption>
        ))}
      </VerticalSlider>
    </Stack>
  );
};
