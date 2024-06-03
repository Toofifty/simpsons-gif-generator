import {
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
      <Box mah={270} maw={360} pos="relative">
        {loading || !clip.url ? (
          <Skeleton height="270" width="360" />
        ) : (
          <>
            {filetype === 'mp4' && (
              <video
                height="270"
                width="360"
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
                width="360"
                height="270"
                src={clip.url}
                withPlaceholder
              />
            )}
          </>
        )}
        <LoadingOverlay visible={!!loading} overlayBlur={2} />
      </Box>
      <Button.Group>
        <Button
          variant="default"
          leftIcon={<IconDownload />}
          onClick={() => download(clip.url)}
        >
          Download {filetype.toLocaleUpperCase()}
        </Button>
        <Tooltip label="Copied!" opened={copied}>
          <Button
            onClick={() => {
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
