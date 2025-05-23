import {
  ActionIcon,
  AspectRatio,
  Badge,
  Flex,
  Image,
  Overlay,
  Paper,
} from '@mantine/core';
import { Clip } from '../../../api';
import { useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';

interface MP4PreviewProps {
  clip: Clip;
}
export const MP4Preview = ({ clip }: MP4PreviewProps) => {
  const [play, setPlay] = useState(false);

  return (
    <Paper radius="sm" pos="relative" sx={{ overflow: 'hidden' }}>
      <AspectRatio ratio={4 / 3}>
        {play ? (
          <video width="100%" autoPlay controls onEnded={() => setPlay(false)}>
            <source src={clip.url} type="video/mp4" />
            Unable to load video
          </video>
        ) : (
          <>
            <Image w="100%" src={clip.snapshot} />
            <Overlay>
              <Flex justify="center" align="center" h="100%">
                <ActionIcon
                  variant="filled"
                  color="green"
                  size="xl"
                  radius="xl"
                  onClick={() => setPlay(true)}
                >
                  <IconPlayerPlay />
                </ActionIcon>
              </Flex>
              <Badge
                variant="filled"
                color="green"
                px="0.5rem"
                sx={(theme) => ({
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  pointerEvents: 'none',
                  boxShadow: theme.shadows.xs,
                  zIndex: 50,
                })}
              >
                MP4
              </Badge>
            </Overlay>
          </>
        )}
      </AspectRatio>
    </Paper>
  );
};
