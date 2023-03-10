import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Overlay,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCopy,
  IconExternalLink,
  IconEye,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Snippet } from '../api';

interface SnippetPreviewProps {
  snippet: Snippet;
}

const f = Intl.NumberFormat('en-US');

const getLink = (snippet: Snippet) => {
  return {
    pathname: '/generate',
    search: new URLSearchParams({
      ...snippet.options,
      begin: snippet.subtitles[0].id,
      end: snippet.subtitles[snippet.subtitles.length - 1].id,
    } as any).toString(),
  };
};

export const SnippetPreview = ({ snippet }: SnippetPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const [playMp4, setPlayMp4] = useState(false);

  return (
    <Paper shadow="md" w={300} radius="sm" sx={() => ({ overflow: 'hidden' })}>
      <Stack
        h="100%"
        justify="space-between"
        sx={() => ({ position: 'relative' })}
      >
        {snippet.options.filetype === 'mp4' ? (
          <Box sx={() => ({ position: 'relative' })}>
            {playMp4 ? (
              <video
                height="225"
                width="300"
                autoPlay
                onEnded={() => setPlayMp4(false)}
              >
                <source src={snippet.url} type="video/mp4" />
                Unable to load video
              </video>
            ) : (
              <>
                <Image src={snippet.snapshot} />
                <Overlay>
                  <Flex justify="center" align="center" h="100%">
                    <ActionIcon
                      variant="filled"
                      color="green"
                      size="xl"
                      radius="xl"
                      onClick={() => setPlayMp4(true)}
                    >
                      <IconPlayerPlay />
                    </ActionIcon>
                  </Flex>
                  <Badge
                    variant="filled"
                    color="green"
                    radius="sm"
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
                    {snippet.options.filetype}
                  </Badge>
                </Overlay>
              </>
            )}
          </Box>
        ) : (
          <>
            <Image src={snippet.url} />
            <Badge
              variant="filled"
              color="blue"
              radius="sm"
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
              {snippet.options.filetype}
            </Badge>
          </>
        )}
        <Box px="lg" sx={() => ({ flex: 1 })}>
          <Badge
            leftSection={
              <ActionIcon color="blue" size="xs" variant="transparent">
                <IconEye />
              </ActionIcon>
            }
          >
            {f.format(snippet.views)}
          </Badge>
          <Box>
            {snippet.subtitles.slice(0, 3).map((subtitle) => (
              <Text key={subtitle.id} size="sm">
                {subtitle.text}
              </Text>
            ))}
            {snippet.subtitles.length > 3 && (
              <Text size="sm" color="dimmed">
                ... {snippet.subtitles.length - 3} more lines
              </Text>
            )}
          </Box>
        </Box>
        <Button.Group sx={() => ({ justifyContent: 'stretch' })}>
          <Tooltip label="Copied!" opened={copied}>
            <Button
              variant="default"
              sx={() => ({ flex: 1 })}
              onClick={() => {
                navigator.clipboard.writeText(snippet.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              leftIcon={<IconCopy />}
            >
              Copy {snippet.options.filetype.toUpperCase()} URL
            </Button>
          </Tooltip>
          <Button
            variant="default"
            size="sm"
            sx={() => ({ flex: 1 })}
            leftIcon={<IconExternalLink />}
            component={NavLink}
            to={getLink(snippet)}
          >
            Fiddle...
          </Button>
        </Button.Group>
      </Stack>
    </Paper>
  );
};
