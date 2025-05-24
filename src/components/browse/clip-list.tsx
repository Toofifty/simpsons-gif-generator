import { Anchor, Flex, Group, Loader, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { ScrollTrigger } from '../scroll-trigger';
import { useClips } from '../../hooks/useClips';
import { PreviewCard } from './clip-preview/preview-card';
import {
  SlideInTransition,
  SlideInTransitionCSS,
} from '../slide-in-transition';
import {
  matchesGenerator,
  useRRViewTransition,
} from '../../hooks/useRRViewTransition';

interface ClipListProps {
  filetype: 'gif' | 'mp4';
  sort: 'recent' | 'popular';
}

export const ClipList = ({ filetype, sort }: ClipListProps) => {
  const { loading, clips, total, fetchMore } = useClips(filetype, sort);

  const { isTransitioning } = useRRViewTransition({
    match: 'both',
    matcher: matchesGenerator,
  });

  if (!loading && (total === 0 || clips.length === 0)) {
    return (
      <Group align="center" m="xl">
        <Text>
          No clips available! Please try again later or{' '}
          <Anchor component={NavLink} to="/generate">
            generate your own
          </Anchor>
          .
        </Text>
      </Group>
    );
  }

  return (
    <>
      <SlideInTransitionCSS />
      <Flex wrap="wrap" gap="lg">
        {clips.map((clip) => (
          <SlideInTransition key={clip.clip_uuid} skip={isTransitioning}>
            {(style) => (
              <PreviewCard filetype={filetype} clip={clip} style={style} />
            )}
          </SlideInTransition>
        ))}
      </Flex>

      {total > clips.length && (
        <Flex justify="center" align="center" h="100%">
          <ScrollTrigger
            id="clip-scroll-trigger"
            onIntersect={fetchMore}
            offset={'-50vh'}
          >
            <Loader m={120} />
          </ScrollTrigger>
        </Flex>
      )}
    </>
  );
};
