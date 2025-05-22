import {
  Accordion,
  Anchor,
  Box,
  Flex,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useClipsByEpisode } from '../hooks/useClipsByEpisode';
import { NavLink } from 'react-router-dom';
import { ClipPreview } from './clip-preview';
import { ScrollTrigger } from './scroll-trigger';
import { range } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface ClipListByEpisodeProps {
  filetype: 'gif' | 'mp4';
}

export const ClipListByEpisode = ({ filetype }: ClipListByEpisodeProps) => {
  const { loading, seasons, clips, total, fetchMore } =
    useClipsByEpisode(filetype);

  const [seasonsVisible, setSeasonsVisible] = useState(() =>
    range(1, 17).map(String)
  );

  useEffect(() => {
    setSeasonsVisible(range(1, 17).map(String));
  }, [filetype]);

  if (!loading && (total === 0 || Object.keys(seasons).length === 0)) {
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
      <Accordion
        chevronPosition="left"
        multiple
        value={seasonsVisible}
        onChange={setSeasonsVisible}
      >
        {Object.entries(seasons).map(([id, episodes]) => (
          <Accordion.Item value={id} key={id}>
            <Accordion.Control>
              <Title size="large">Season {id}</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack align="start">
                {episodes.map((episode) => (
                  <Paper
                    key={episode.id}
                    shadow="md"
                    radius="md"
                    p="md"
                    mx="-md"
                  >
                    <Title size="medium" mb="lg">
                      {episode.identifier.toUpperCase()} {episode.title}
                    </Title>
                    <Flex wrap="wrap" gap="lg">
                      {episode.clips.map((clip) => (
                        <ClipPreview
                          key={clip.clip_uuid}
                          filetype={filetype}
                          clip={clip}
                        />
                      ))}
                    </Flex>
                  </Paper>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

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
