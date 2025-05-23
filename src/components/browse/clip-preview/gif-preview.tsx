import { AspectRatio, Badge, Image, Paper, Tooltip } from '@mantine/core';
import { Clip } from '../../../api';

interface GifPreviewProps {
  clip: Clip;
}

export const GifPreview = ({ clip }: GifPreviewProps) => (
  <Paper m="xs" radius="sm" pos="relative" sx={{ overflow: 'hidden' }}>
    <AspectRatio ratio={4 / 3}>
      <Image src={clip.url} />
    </AspectRatio>
    <Badge
      variant="filled"
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
      GIF
    </Badge>
  </Paper>
);
