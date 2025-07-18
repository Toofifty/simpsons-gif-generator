import {
  Anchor,
  Box,
  Flex,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import { ScrollTrigger } from '../scroll-trigger';
import { range, useMediaQuery } from '@mantine/hooks';
import { PreviewCard } from './clip-preview/preview-card';
import { useClipsBySeason } from '../../hooks/useClipsBySeason';
import { EpisodeTitle } from '../episode-title';
import { Clip, Episode } from '../../api';
import {
  SlideInTransition,
  SlideInTransitionCSS,
} from '../slide-in-transition';
import {
  matchesGenerator,
  useRRViewTransition,
} from '../../hooks/useRRViewTransition';
import { CustomSegmentedControl } from '../custom-segmented-control';

interface ClipListByEpisodeProps {
  filetype: 'gif' | 'mp4';
}

export const ClipListByEpisode = ({ filetype }: ClipListByEpisodeProps) => {
  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const { season: seasonId } = useParams<{ season: string }>();
  const safeSeasonId =
    isNaN(Number(seasonId)) || Number(seasonId) < 1 || Number(seasonId) > 17
      ? '1'
      : seasonId;

  const { episodes, clips, total, loading, fetchMore } = useClipsBySeason(
    filetype,
    Number(safeSeasonId)
  );

  const navigate = useNavigate();
  const setSeasonId = (id: string) =>
    navigate(`/browse/season/${id}`, { viewTransition: true });

  const { isTransitioning } = useRRViewTransition({
    match: 'both',
    matcher: matchesGenerator,
  });

  if (safeSeasonId !== seasonId) {
    return <Navigate to="/browse/season/1" />;
  }

  return (
    <>
      <SlideInTransitionCSS />
      {isTablet ? (
        <Flex align="center" justify="space-between" mt="-lg">
          <Text>Season</Text>
          <Select
            data={range(1, 17).map((id) => ({
              label: `Season ${id}`,
              value: String(id),
            }))}
            value={safeSeasonId}
            onChange={setSeasonId}
            allowDeselect={false}
          />
        </Flex>
      ) : (
        <CustomSegmentedControl
          mt="-lg"
          mb="lg"
          color="blue"
          w="100%"
          data={range(1, 17).map((id) => ({
            label: `S${id}`,
            value: String(id),
          }))}
          value={safeSeasonId}
          onChange={setSeasonId}
        />
      )}
      {total > 0 ? (
        <Stack align="start" justify="stretch">
          {episodes.map((episode) => (
            <SlideInTransition key={episode.id} skip={isTransitioning}>
              {(style) => (
                <EpisodeBox
                  key={episode.id}
                  filetype={filetype}
                  episode={episode}
                  style={style}
                />
              )}
            </SlideInTransition>
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

const EpisodeBox = ({
  filetype,
  episode,
  style,
}: {
  filetype: 'gif' | 'mp4';
  episode: Episode & { clips: Clip[] };
  style?: React.CSSProperties;
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Paper
      key={episode.id}
      radius="lg"
      p="md"
      mx="-md"
      w="calc(100% + 2rem)"
      bg={colorScheme === 'dark' ? 'dark.6' : 'gray.1'}
      withBorder={colorScheme === 'light'}
      style={style}
    >
      <Paper
        radius="lg"
        style={{ position: 'sticky', top: 64, zIndex: 5 }}
        bg={colorScheme === 'dark' ? 'dark.6' : 'gray.1'}
        p="md"
        m="-md"
        mb="0"
      >
        <EpisodeTitle
          identifier={episode.identifier}
          title={episode.title}
          ml="sm"
        />
      </Paper>
      <Flex wrap="wrap" gap="lg" sx={{ overflow: 'visible' }}>
        {episode.clips.map((clip) => (
          <PreviewCard key={clip.clip_uuid} filetype={filetype} clip={clip} />
        ))}
      </Flex>
    </Paper>
  );
};
