import {
  Box,
  Button,
  Flex,
  Image,
  LoadingOverlay,
  Skeleton,
  Stack,
  Tooltip,
} from '@mantine/core';
import { IconCopy, IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { SnippetResponseData } from '../../api';

interface ViewerProps {
  loading?: boolean;
  snippet: SnippetResponseData;
  filetype: 'mp4' | 'gif';
}

export const Viewer = ({ loading, snippet, filetype }: ViewerProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <Stack align="center">
      <Box mah={270} maw={360} pos="relative">
        {loading || !snippet.url ? (
          <Skeleton height="270" width="360" />
        ) : (
          <>
            {filetype === 'mp4' && (
              <video height="270" width="360" controls loop autoPlay>
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
          component="a"
          href={snippet.url}
          target="_blank"
          download
          variant="default"
          leftIcon={<IconDownload />}
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