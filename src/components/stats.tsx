import { Loader, Stack, Text } from '@mantine/core';
import { useStats } from '../hooks/useStats';

export const Stats = () => {
  const { stats, loading } = useStats();

  const f = Intl.NumberFormat('en-US');

  if (loading || !stats) {
    return <Loader color="gray" />;
  }

  return (
    <Stack>
      <Text color="dimmed">
        Seasons indexed: {f.format(stats!.seasons_indexed)}
      </Text>
      <Text color="dimmed">
        Episodes indexed: {f.format(stats!.episodes_indexed)}
      </Text>
      <Text color="dimmed">
        Total subtitles: {f.format(stats!.subtitles_indexed)}
      </Text>
      <Text color="dimmed">
        GIFs generated: {f.format(stats!.gifs_generated)}
      </Text>
      <Text color="dimmed">
        MP4s generated: {f.format(stats!.mp4s_generated)}
      </Text>
    </Stack>
  );
};
