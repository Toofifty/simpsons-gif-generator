import { Box, Stack, Text } from '@mantine/core';

interface PreviewSubtitlesProps {
  subtitles: {
    id: number;
    text: string;
  }[];
  max: number;
}

export const PreviewSubtitles = ({ subtitles, max }: PreviewSubtitlesProps) => (
  <Stack spacing="xs" m="xs">
    {subtitles.slice(0, max).map((subtitle) => (
      <Text key={subtitle.id} size="sm" italic>
        {subtitle.text}
      </Text>
    ))}
    {subtitles.length > max && (
      <Text size="sm" color="dimmed">
        ... {subtitles.length - max} more lines
      </Text>
    )}
  </Stack>
);
