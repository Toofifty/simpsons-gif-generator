import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { api, Clip } from '../../../api';
import {
  IconAlignJustified,
  IconArticle,
  IconCopy,
  IconPencil,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

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

interface PreviewActionsProps {
  filetype: 'gif' | 'mp4';
  clip: Clip;
  toggleTranscript?: () => void;
  showTranscript?: boolean;
}

export const PreviewActions = ({
  filetype,
  clip,
  toggleTranscript,
  showTranscript,
}: PreviewActionsProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(clip.url);
    // yolo
    clip.copies++;
    api.trackCopy({ uuid: clip.generation_uuid });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Group spacing="xs">
      {toggleTranscript && (
        <Tooltip label={showTranscript ? 'Hide transcript' : 'Show transcript'}>
          <ActionIcon
            variant={showTranscript ? 'filled' : 'light'}
            radius="md"
            onClick={toggleTranscript}
          >
            <IconAlignJustified size="16" />
          </ActionIcon>
        </Tooltip>
      )}
      <Tooltip label="Edit">
        <ActionIcon
          variant="light"
          radius="md"
          component={NavLink}
          to={getLink(clip)}
        >
          <IconPencil size="16" />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={copied ? 'Copied!' : `Copy ${filetype.toUpperCase()} URL`}
      >
        <ActionIcon variant="light" color="blue" radius="md" onClick={onCopy}>
          <IconCopy size="16" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
