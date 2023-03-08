import {
  Button,
  Checkbox,
  Flex,
  Input,
  Slider,
  Stack,
  Text,
} from '@mantine/core';

const TIME_MARKS = [
  { value: -5, label: '-5s' },
  { value: 0, label: '0s' },
  { value: 5, label: '+5s' },
];

const RESOLUTION_MARKS = [
  { value: 240, label: '240p' },
  { value: 360, label: '360p' },
  { value: 480, label: '480p' },
  { value: 720, label: '720p' },
];

interface ControlsProps {
  filetype: 'mp4' | 'gif';
  setFiletype: (filetype: 'mp4' | 'gif') => void;
  subtitles?: boolean;
  setSubtitles: (subtitles: boolean) => void;
  resolution?: number;
  setResolution: (resolution: number) => void;
  extend?: number;
  setExtend: (extend: number) => void;
  offset?: number;
  setOffset: (offset: number) => void;
}

export const Controls = ({
  filetype,
  setFiletype,
  subtitles,
  setSubtitles,
  resolution,
  setResolution,
  extend,
  setExtend,
  offset,
  setOffset,
}: ControlsProps) => {
  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Text size="sm" tt="uppercase" fz="md">
          {filetype} options
        </Text>
        <Button.Group>
          <Button
            variant={filetype === 'mp4' ? 'filled' : 'default'}
            size="sm"
            onClick={() => setFiletype('mp4')}
          >
            MP4
          </Button>
          <Button
            variant={filetype === 'gif' ? 'filled' : 'default'}
            size="sm"
            onClick={() => setFiletype('gif')}
          >
            GIF
          </Button>
        </Button.Group>
      </Flex>
      <Checkbox
        checked={!!subtitles}
        onChange={(e) => setSubtitles(e.currentTarget.checked)}
        label="Render subtitles"
      />
      <Input.Wrapper
        label="Offset"
        description="Change the starting point of the snippet"
        mb="md"
        styles={(theme) => ({
          description: { marginBottom: theme.spacing.xs },
        })}
      >
        <Slider
          label={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}s`}
          min={-10}
          max={10}
          step={0.1}
          marks={TIME_MARKS}
          value={offset ?? 0}
          onChange={setOffset}
        />
      </Input.Wrapper>
      <Input.Wrapper
        label="Extend"
        description="Increase or decrease the length of the snippet"
        mb="md"
        styles={(theme) => ({
          description: { marginBottom: theme.spacing.xs },
        })}
      >
        <Slider
          label={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}s`}
          min={-10}
          max={10}
          step={0.1}
          marks={TIME_MARKS}
          value={extend ?? 0}
          onChange={setExtend}
        />
      </Input.Wrapper>
      <Input.Wrapper
        label="Resolution"
        description="Caution: higher resolutions will take longer to generate"
        mb="md"
        styles={(theme) => ({
          description: { marginBottom: theme.spacing.xs },
        })}
      >
        <Slider
          label={(val) => `${val}p`}
          step={120}
          min={240}
          max={720}
          marks={RESOLUTION_MARKS}
          value={resolution ?? 240}
          onChange={setResolution}
        />
      </Input.Wrapper>
    </Stack>
  );
};
