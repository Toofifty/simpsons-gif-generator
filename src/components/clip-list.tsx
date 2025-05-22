import {
  Anchor,
  Flex,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { ClipPreview } from './clip-preview';
import { ScrollTrigger } from './scroll-trigger';
import { useClips } from '../hooks/useClips';

interface ClipListProps {
  filetype: 'gif' | 'mp4';
  sort: 'recent' | 'popular';
}

export const ClipList = ({ filetype, sort }: ClipListProps) => {
  const { loading, clips, total, fetchMore } = useClips(filetype, sort);

  if (!loading && (total === 0 || clips.length === 0)) {
    return (
      <Group position="center" m="xl">
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
      <Flex wrap="wrap" gap="lg">
        {clips.map((clip) => (
          <ClipPreview key={clip.clip_uuid} filetype={filetype} clip={clip} />
        ))}
      </Flex>

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
