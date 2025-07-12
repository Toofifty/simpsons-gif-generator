import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { api, Clip } from '../../../api';
import { IconAlignJustified, IconCopy, IconPencil } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

const getSearchParams = (clip: Clip) => ({
  begin: String(clip.subtitles[0].id),
  end: String(clip.subtitles[clip.subtitles.length - 1].id),
  ...(clip.options.offset !== 0 && { offset: String(clip.options.offset) }),
  ...(clip.options.extend !== 0 && { extend: String(clip.options.extend) }),
});

export const getLink = (clip: Clip) => {
  return {
    pathname: '/generate',
    search: `?${new URLSearchParams(getSearchParams(clip)).toString()}`,
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
        <Tooltip
          label={showTranscript ? 'Hide transcript' : 'Show transcript'}
          radius="md"
        >
          <ActionIcon
            variant={showTranscript ? 'filled' : 'default'}
            radius="md"
            onClick={toggleTranscript}
          >
            <IconAlignJustified size="16" />
          </ActionIcon>
        </Tooltip>
      )}
      <Tooltip label="Edit" radius="md">
        <ActionIcon
          variant="default"
          radius="md"
          component={NavLink}
          to={getLink(clip)}
          viewTransition
        >
          <IconPencil size="16" />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={copied ? 'Copied!' : `Copy ${filetype.toUpperCase()} URL`}
        radius="md"
      >
        <ActionIcon variant="light" color="blue" radius="md" onClick={onCopy}>
          <IconCopy size="16" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
