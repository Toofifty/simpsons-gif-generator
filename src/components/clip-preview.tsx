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
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCopy,
  IconExternalLink,
  IconEye,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Clip, api } from '../api';

interface ClipPreviewProps {
  filetype: 'gif' | 'mp4';
  clip: Clip;
}

const f = Intl.NumberFormat('en-US');

const getLink = (clip: Clip) => {
  return {
    pathname: '/generate',
    search: new URLSearchParams({
      ...clip.options,
      begin: clip.subtitles[0].id,
      end: clip.subtitles[clip.subtitles.length - 1].id,
    } as any).toString(),
  };
};

export const ClipPreview = ({ filetype, clip }: ClipPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const [playMp4, setPlayMp4] = useState(false);

  const theme = useMantineTheme();
  const isMedium = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Paper
      shadow="md"
      w={isSmall ? '100%' : isMedium ? 'calc(50% - 0.75rem)' : 300}
      radius="md"
      sx={() => ({ overflow: 'hidden' })}
    >
      <Stack
        h="100%"
        justify="space-between"
        sx={() => ({ position: 'relative' })}
      >
        {filetype === 'mp4' ? (
          <Box sx={() => ({ position: 'relative' })}>
            {playMp4 ? (
              <video
                width="100%"
                autoPlay
                controls
                onEnded={() => setPlayMp4(false)}
              >
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
                    {filetype}
                  </Badge>
                </Overlay>
              </>
            )}
          </Box>
        ) : (
          <>
            <Image w="100%" src={clip.url} />
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
              {filetype}
            </Badge>
          </>
        )}
        <Box px="sm" sx={() => ({ flex: 1 })}>
          <Badge
            mr="sm"
            leftSection={
              <ActionIcon color="blue" size="xs" variant="transparent">
                <IconEye />
              </ActionIcon>
            }
          >
            {f.format(clip.views)}
          </Badge>
          <Badge
            leftSection={
              <ActionIcon color="blue" size="xs" variant="transparent">
                <IconCopy />
              </ActionIcon>
            }
          >
            {f.format(clip.copies)}
          </Badge>
          <Box>
            {clip.subtitles.slice(0, 3).map((subtitle) => (
              <Text key={subtitle.id} size="sm">
                {subtitle.text}
              </Text>
            ))}
            {clip.subtitles.length > 3 && (
              <Text size="sm" color="dimmed">
                ... {clip.subtitles.length - 3} more lines
              </Text>
            )}
          </Box>
        </Box>
        <Button.Group sx={() => ({ justifyContent: 'stretch' })}>
          <Tooltip label="Copied!" opened={copied}>
            <Button
              variant="subtle"
              color="gray"
              sx={{ flex: 1 }}
              onClick={() => {
                navigator.clipboard.writeText(clip.url);
                // yolo
                clip.copies++;
                api.trackCopy({ uuid: clip.generation_uuid });
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              leftIcon={<IconCopy />}
            >
              Copy {filetype.toUpperCase()} URL
            </Button>
          </Tooltip>
          <Button
            variant="subtle"
            color="gray"
            sx={{ flex: 1 }}
            leftIcon={<IconExternalLink />}
            component={NavLink}
            to={getLink(clip)}
          >
            Edit
          </Button>
        </Button.Group>
      </Stack>
    </Paper>
  );
};
