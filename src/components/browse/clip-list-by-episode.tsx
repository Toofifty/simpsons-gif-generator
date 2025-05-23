import {
  Anchor,
  Badge,
  Flex,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { ScrollTrigger } from './scroll-trigger';
import { range, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { PreviewCard } from './clip-preview/preview-card';
import { withTransition } from '../../util/with-transition';
import { useClipsBySeason } from '../../hooks/useClipsBySeason';
import { Episode } from '../../api';

interface ClipListByEpisodeProps {
  filetype: 'gif' | 'mp4';
}

export const ClipListByEpisode = ({ filetype }: ClipListByEpisodeProps) => {
  const { colorScheme } = useMantineColorScheme();

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const [seasonId, setSeasonId] = useState('1');
  const { episodes, clips, total, loading, fetchMore } = useClipsBySeason(
    filetype,
    Number(seasonId)
  );

  return (
    <>
      {isTablet ? (
        <Flex align="center" justify="space-between" mt="-lg">
          <Text>Season</Text>
          <Select
            data={range(1, 17).map((id) => ({
              label: `Season ${id}`,
              value: id.toFixed(0),
            }))}
            value={seasonId}
            onChange={withTransition(setSeasonId) as any}
            allowDeselect={false}
          />
        </Flex>
      ) : (
        <SegmentedControl
          mt="-lg"
          mb="lg"
          color="blue"
          fullWidth
          data={range(1, 17).map((id) => ({
            label: `S${id}`,
            value: id.toFixed(0),
          }))}
          value={seasonId}
          onChange={withTransition(setSeasonId)}
        />
      )}
      {total > 0 ? (
        <Stack align="start" justify="stretch">
          {episodes.map((episode) => (
            <Paper
              key={episode.id}
              radius="md"
              p="md"
              mx="-md"
              w="calc(100% + 2rem)"
              bg={colorScheme === 'dark' ? 'dark.6' : 'gray.1'}
              withBorder={colorScheme === 'light'}
            >
              <EpisodeTitle episode={episode} />
              <Flex wrap="wrap" gap="lg" sx={{ overflow: 'visible' }}>
                {episode.clips.map((clip) => (
                  <PreviewCard
                    key={clip.clip_uuid}
                    filetype={filetype}
                    clip={clip}
                  />
                ))}
              </Flex>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Group align="center" m="xl">
          {!loading && (
            <Text>
              No clips available for season {seasonId}. Please try again later
              or{' '}
              <Anchor component={NavLink} to="/generate">
                generate your own
              </Anchor>
              .
            </Text>
          )}
        </Group>
      )}

      {total > clips.length && (
        <Flex justify="center" align="center" h="100%">
          <ScrollTrigger id="clip-scroll-trigger" onIntersect={fetchMore}>
            <Loader m={120} />
          </ScrollTrigger>
        </Flex>
      )}
    </>
  );
};

const EpisodeTitle = ({ episode }: { episode: Episode }) => (
  <Group align="center" ml="sm" mb="md">
    <Badge variant="filled">{episode.identifier.toUpperCase()}</Badge>
    <Title size="medium">{episode.title}</Title>
  </Group>
);
