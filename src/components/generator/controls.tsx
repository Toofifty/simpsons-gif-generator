import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Slider,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconSettings, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { QuoteContextResponseData } from '../../api';
import { useOptionsContext } from '../../hooks/useOptionsContext';
import { SubmitCorrection } from './submit-correction';

const TIME_MARKS = [
  { value: -5, label: '-5s' },
  { value: 0, label: '0s' },
  { value: 5, label: '+5s' },
  { value: 10, label: '+10s' },
  { value: 15, label: '+15s' },
];

const RESOLUTION_MARKS = [
  { value: 240, label: '240p' },
  { value: 360, label: '360p' },
  { value: 480, label: '480p' },
];

interface ControlsProps {
  context: QuoteContextResponseData;
}

export const Controls = ({ context }: ControlsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submittingCorrection, setSubmittingCorrection] = useState<number>();

  const {
    options: { filetype = 'gif', ...options },
    setOption,
  } = useOptionsContext();

  return (
    <Stack>
      <SubmitCorrection
        context={context}
        correction={submittingCorrection}
        onClose={() => setSubmittingCorrection(undefined)}
      />
      <Flex justify="space-between" align="center">
        <Text size="sm" tt="uppercase" fz="md">
          {filetype} options
        </Text>
        <Flex align="center" gap="sm">
          <Tooltip
            label={(showAdvanced ? 'Hide' : 'Show') + ' advanced options'}
          >
            <ActionIcon
              variant={showAdvanced ? 'filled' : 'subtle'}
              color={showAdvanced ? 'blue' : 'gray'}
              size="lg"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              <IconSettings size="1.25rem" />
            </ActionIcon>
          </Tooltip>
          <Button.Group>
            <Button
              variant={filetype === 'mp4' ? 'filled' : 'default'}
              size="sm"
              onClick={() => setOption('filetype', 'mp4')}
            >
              MP4
            </Button>
            <Button
              variant={filetype === 'gif' ? 'filled' : 'default'}
              size="sm"
              onClick={() => setOption('filetype', 'gif')}
            >
              GIF
            </Button>
          </Button.Group>
        </Flex>
      </Flex>
      <Checkbox
        checked={!!options.subtitles}
        onChange={(e) => setOption('subtitles', e.currentTarget.checked)}
        label="Render subtitles"
      />
      <Box pos="relative">
        <Input.Wrapper
          label="Subtitle offset"
          description="Change the starting point of the snippet"
          mb="md"
          styles={(theme) => ({
            description: { marginBottom: theme.spacing.xs },
          })}
        >
          <Slider
            label={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}s`}
            min={-5}
            max={showAdvanced ? 5 : 15}
            step={showAdvanced ? 0.1 : 0.5}
            marks={showAdvanced ? TIME_MARKS.slice(0, 3) : TIME_MARKS}
            value={options.offset ?? 0}
            onChange={(o) => setOption('offset', o)}
          />
        </Input.Wrapper>
        {showAdvanced && (
          <Flex
            gap="sm"
            align="center"
            sx={() => ({ position: 'absolute', top: 0, right: 0 })}
          >
            {context.meta.subtitle_correction !== undefined && (
              <Tooltip label="Current episode subtitle offset">
                <Badge tt="initial">
                  {context.meta.subtitle_correction > 0 && '+'}
                  {(context.meta.subtitle_correction / 1000).toFixed(2)}s
                </Badge>
              </Tooltip>
            )}
            <Tooltip label="Send subtitle correction to API">
              <ActionIcon
                variant="subtle"
                onClick={() => setSubmittingCorrection(options.offset)}
              >
                <IconUpload />
              </ActionIcon>
            </Tooltip>
          </Flex>
        )}
      </Box>
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
          min={-5}
          max={15}
          step={0.5}
          marks={TIME_MARKS}
          value={options.extend ?? 0}
          onChange={(e) => setOption('extend', e)}
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
          min={120}
          max={720}
          marks={RESOLUTION_MARKS}
          value={options.resolution ?? 480}
          onChange={(r) => setOption('resolution', r)}
        />
      </Input.Wrapper>
    </Stack>
  );
};
