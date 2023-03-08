import { Flex, Loader, Paper, Stack, Text } from '@mantine/core';
import { useState } from 'react';
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
  const [extend, setExtend] = useState<number>();
  const [offset, setOffset] = useState<number>();
  const [resolution, setResolution] = useState<number>(360);
  const [subtitles, setSubtitles] = useState<boolean>();
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

  if (!context || !snippet) {
    return (
      <Paper>
        <Loader />
      </Paper>
    );
  }

  return (
    <Paper shadow="xl" p="xl" m="xl" maw="800px" mx="auto">
      <Text fz="xl">
        Season {context.meta.season_number}, Episode{' '}
        {context.meta.episode_in_season}: {context.meta.episode_title}
      </Text>
      <Flex my="lg" mah={700}>
        <Stack>
          <Viewer loading={loading} snippet={snippet} filetype={filetype} />
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
        <Context
          begin={begin}
          end={end}
          context={context}
          setRange={setRange}
        />
      </Flex>
      {!!responseTime && <Text fz="sm">Generated in {responseTime}ms</Text>}
    </Paper>
  );
};
