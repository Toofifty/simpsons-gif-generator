import {
  Box,
  Flex,
  Paper,
  Stack,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Clip } from '../../../api';
import { GifPreview } from './gif-preview';
import { MP4Preview } from './mp4-preview';
import { PreviewBadges } from './preview-badges';
import { getLink, PreviewActions } from './preview-actions';
import { PreviewSubtitles } from './preview-subtitles';
import { useState } from 'react';
import { useRRViewTransition } from '../../../hooks/useRRViewTransition';

interface PreviewCardProps {
  filetype: 'gif' | 'mp4';
  clip: Clip;
}

export const PreviewCard = ({ filetype, clip }: PreviewCardProps) => {
  const theme = useMantineTheme();
  const isMedium = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [showTranscript, setShowTranscript] = useState(false);

  const { vt } = useRRViewTransition({
    location: getLink(clip),
    match: 'both',
  });

  return (
    <Paper
      shadow="sm"
      w={isSmall ? '100%' : isMedium ? 'calc(50% - 0.75rem)' : 300}
      radius="md"
      miw="300px"
      style={vt('main-panel')}
    >
      <Stack
        spacing={0}
        h="100%"
        justify="space-between"
        style={{ position: 'relative' }}
      >
        <Box p="xs">
          <Box style={vt('main-viewer')}>
            {filetype === 'mp4' ? (
              <MP4Preview clip={clip} />
            ) : (
              <GifPreview clip={clip} />
            )}
          </Box>
        </Box>
        <Box p="xs" pt="0" style={{ flex: 1 }}>
          <Flex justify="space-between" align="center">
            <PreviewBadges views={clip.views} copies={clip.copies} />
            <PreviewActions
              filetype={filetype}
              clip={clip}
              toggleTranscript={() => setShowTranscript((v) => !v)}
              showTranscript={showTranscript}
            />
          </Flex>
        </Box>
        <Transition
          mounted={showTranscript}
          transition="fade"
          duration={200}
          timingFunction="ease"
        >
          {(styles) => (
            <Paper
              pos="absolute"
              w="100%"
              top="calc(100% - 0.5rem)"
              shadow="sm"
              p="sm"
              style={styles}
              sx={{ zIndex: 1000 }}
            >
              <PreviewSubtitles subtitles={clip.subtitles} max={8} />
            </Paper>
          )}
        </Transition>
      </Stack>
    </Paper>
  );
};
