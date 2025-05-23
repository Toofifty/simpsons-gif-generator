import { AspectRatio, Badge, Image, Paper } from '@mantine/core';
import { Clip } from '../../../api';

interface GifPreviewProps {
  clip: Clip;
  style?: React.CSSProperties;
}

export const GifPreview = ({ clip, style }: GifPreviewProps) => (
  <Paper radius="sm" pos="relative" sx={{ overflow: 'hidden' }}>
    <AspectRatio ratio={4 / 3}>
      <Image src={clip.url} style={style} />
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
