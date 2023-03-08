import { ScrollArea, Stack, Text, useMantineTheme } from '@mantine/core';
import { QuoteContextResponseData } from '../../api';
import { SliderOption } from '../vertical-slider/slider-option';
import { VerticalSlider } from '../vertical-slider/vertical-slider';

interface ContextProps {
  context: QuoteContextResponseData;
  setRange: (begin: number, end: number) => void;
  begin: number;
  end: number;
}

export const Context = ({ context, begin, end, setRange }: ContextProps) => {
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
        startIndex={begin - firstId}
        endIndex={end - firstId}
        setRange={(startIndex, endIndex) =>
          setRange(startIndex + firstId, endIndex + firstId)
        }
      >
        {lines.map(({ id, text }) => (
          <SliderOption key={id} active={id >= begin && id < end}>
            <Text
              color={
                id >= begin && id <= end
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
