import {
  Box,
  Divider,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useGenerator } from '../../hooks/useGenerator';
import { Context } from './context';
import { Controls } from './controls';
import { Viewer } from './viewer';

interface GeneratorProps {
  begin: number;
  end: number;
  setRange: (begin: number, end: number) => void;
}

export const Generator = ({ begin, end, setRange }: GeneratorProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const [extend, setExtend] = useState(0);
  const [offset, setOffset] = useState(0);
  const [resolution, setResolution] = useState(360);
  const [subtitles, setSubtitles] = useState(true);
  const [filetype, setFiletype] = useState<'mp4' | 'gif'>('gif');

  const { context, snippet, loading, responseTime } = useGenerator({
    begin,
    end,
    extend,
    offset,
    resolution,
    subtitles,
    filetype,
  });

  useEffect(() => {
    setExtend(0);
    setOffset(0);
  }, [begin, end]);

  if (!context || !snippet) {
    return (
      <Paper shadow="xl" p="xl" m="xl" maw="800px" mx="auto">
        <Flex justify="center">
          <Loader color="gray" mx="auto" />
        </Flex>
      </Paper>
    );
  }

  return (
    <Box mx="auto" maw="800px">
      <Paper shadow="xl" p="xl" m="xl" mx="lg">
        <Text fz="xl">
          Season {context.meta.season_number}, Episode{' '}
          {context.meta.episode_in_season}: {context.meta.episode_title}
        </Text>
        <Flex
          my="lg"
          mah={isMobile ? undefined : 700}
          direction={isMobile ? 'column' : undefined}
        >
          <Stack>
            <Viewer loading={loading} snippet={snippet} filetype={filetype} />
            {isMobile && (
              <>
                <Divider my="xl" />
                <Context
                  begin={begin}
                  end={end}
                  context={context}
                  setRange={setRange}
                />
                <Divider my="xl" />
              </>
            )}
            <Controls
              {...{
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
              }}
            />
          </Stack>
          {!isMobile && (
            <Context
              begin={begin}
              end={end}
              context={context}
              setRange={setRange}
            />
          )}
        </Flex>
        {!!responseTime && (
          <Text fz="sm" color="dimmed">
            Generated in {responseTime}ms
          </Text>
        )}
      </Paper>
    </Box>
  );
};
