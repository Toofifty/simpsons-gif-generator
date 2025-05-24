import {
  AspectRatio,
  Box,
  Button,
  Image,
  LoadingOverlay,
  Skeleton,
  Stack,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconCopy, IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { api, ClipResponseData } from '../../api';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { download } from '../../utils';

interface ViewerProps {
  loading?: boolean;
  clip: ClipResponseData;
}

export const Viewer = ({ loading, clip }: ViewerProps) => {
  const theme = useMantineTheme();
  const [copied, setCopied] = useState(false);

  const {
    options: { filetype = 'gif' },
  } = useOptionsContext();

  return (
    <Stack align="center">
      <Box
        h={270}
        w={360}
        maw="100%"
        pos="relative"
        style={{ viewTransitionName: 'main-viewer' }}
      >
        <AspectRatio ratio={4 / 3} w={360} maw="100%">
          {filetype === 'mp4' && (
            <video
              controls
              loop
              autoPlay
              style={{ borderRadius: theme.radius.sm }}
            >
              <source src={clip.url} type="video/mp4" />
              Unable to load video
            </video>
          )}
          {filetype !== 'mp4' && (
            <Image
              radius="sm"
              fit="contain"
              maw="100%"
              src={clip.url}
              withPlaceholder
            />
          )}
        </AspectRatio>
        <LoadingOverlay visible={!!loading} overlayBlur={2} />
      </Box>
      <Button.Group>
        <Button
          variant="default"
          leftIcon={<IconDownload />}
          onClick={clip ? () => download(clip.url) : undefined}
        >
          Download {filetype.toLocaleUpperCase()}
        </Button>
        <Tooltip label="Copied!" opened={copied}>
          <Button
            onClick={() => {
              if (!clip) {
                return;
              }

              navigator.clipboard.writeText(clip.url);
              api.trackCopy({ uuid: clip.generation_uuid });
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            variant="default"
            leftIcon={<IconCopy />}
          >
            Copy {filetype.toLocaleUpperCase()} URL
          </Button>
        </Tooltip>
      </Button.Group>
    </Stack>
  );
};

export const ViewerPlaceholder = () => (
  <Stack align="center">
    <Box
      mah={270}
      maw={360}
      pos="relative"
      style={{ viewTransitionName: 'main-viewer' }}
    >
      <Skeleton width={360} height={270} radius="sm" />
    </Box>
    <Skeleton width={325} height={36} />
  </Stack>
);
