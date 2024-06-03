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
import { notifications } from '@mantine/notifications';
import {
  IconCopy,
  IconDownload,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { useState } from 'react';
import { api, ClipResponseData } from '../../api';
import { useGeneratorContext } from '../../hooks/useGeneratorContext';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { assert, download } from '../../utils';

interface ViewerProps {
  loading?: boolean;
  snippet: ClipResponseData;
}

export const Viewer = ({ loading, snippet }: ViewerProps) => {
  const theme = useMantineTheme();
  const [copied, setCopied] = useState(false);

  const {
    options: { filetype = 'gif' },
  } = useOptionsContext();

  return (
    <Stack align="center">
      <Box mah={270} maw={360} pos="relative">
        {loading || !snippet.url ? (
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
                <source src={snippet.url} type="video/mp4" />
                Unable to load video
              </video>
            )}
            {filetype !== 'mp4' && (
              <Image
                radius="sm"
                fit="contain"
                width="360"
                height="270"
                src={snippet.url}
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
          onClick={() => download(snippet.url)}
        >
          Download {filetype.toLocaleUpperCase()}
        </Button>
        <Tooltip label="Copied!" opened={copied}>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(snippet.url);
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
