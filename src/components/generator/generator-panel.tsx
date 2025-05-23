import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useGenerator } from '../../hooks/useGenerator';
import { GeneratorContext } from '../../hooks/useGeneratorContext';
import { Context } from './context';
import { Controls } from './controls';
import { Viewer } from './viewer';
import { EpisodeTitle, getIdentifier } from '../episode-title';
import { ClipResponseData, QuoteContextResponseData } from '../../api';

export const GeneratorPanel = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const {
    context: loadedContext,
    clip: loadedClip,
    loading,
    responseTime,
    invalidate,
  } = useGenerator();

  const [mobileContextOpen, { toggle: toggleMobileContext }] =
    useDisclosure(false);

  const context =
    loadedContext ??
    ({
      meta: {
        episode_title: '',
        season_number: 0,
        episode_number: 0,
        episode_in_season: 0,
        season_title: '',
      },
      matches: {
        before: [{ episode_id: 0, id: 0, text: '' } as any],
        lines: [],
        after: [],
      },
    } satisfies QuoteContextResponseData);
  const clip =
    loadedClip ??
    ({
      cached: false,
      clip_copies: 0,
      clip_uuid: '',
      clip_views: 0,
      generation_copies: 0,
      generation_uuid: '',
      generation_views: 0,
      render_time: 0,
      url: '',
      subtitle_correction: 0,
    } satisfies ClipResponseData);

  return (
    <GeneratorContext.Provider
      value={{ context, clip, loading, responseTime, invalidate }}
    >
      <Box mx="auto" maw="800px">
        <Paper
          shadow="xl"
          p="xl"
          m="xl"
          mx="lg"
          style={{ viewTransitionName: 'main-panel' }}
        >
          <EpisodeTitle
            identifier={
              context
                ? getIdentifier(
                    context.meta.season_number,
                    context.meta.episode_number
                  )
                : 'S00E00'
            }
            title={context?.meta.episode_title ?? ''}
          />
          <Flex
            my="lg"
            mah={isMobile ? undefined : 800}
            direction={isMobile ? 'column' : undefined}
          >
            <Stack>
              <Viewer loading={false} clip={clip} />
              <Divider my="lg" mb={isMobile ? 'sm' : undefined} />
              {isMobile && (
                <>
                  <Button
                    variant="outline"
                    color="gray"
                    onClick={toggleMobileContext}
                    ta="left"
                    tt="uppercase"
                    mt="-lg"
                    rightIcon={
                      mobileContextOpen ? (
                        <IconChevronUp />
                      ) : (
                        <IconChevronDown />
                      )
                    }
                  >
                    {mobileContextOpen ? 'Hide' : 'Show'} subtitle scrubber
                  </Button>
                  <Collapse in={mobileContextOpen}>
                    <Context
                      key={mobileContextOpen ? 'trigger' : 'rerender'}
                      context={context}
                    />
                    <Divider my="xl" />
                  </Collapse>
                </>
              )}
              <Controls context={context} />
            </Stack>
            {!isMobile && <Context ml="lg" context={context} />}
          </Flex>
          {!!responseTime && (
            <Text fz="sm" color="dimmed">
              Generated in {responseTime}ms
            </Text>
          )}
        </Paper>
      </Box>
    </GeneratorContext.Provider>
  );
};
