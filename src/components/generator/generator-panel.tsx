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
import { useGenerator } from '../../hooks/useGenerator';
import { Context } from './context';
import { Controls } from './controls';
import { Viewer } from './viewer';

export const GeneratorPanel = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { context, snippet, loading, responseTime } = useGenerator();

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
            <Viewer loading={loading} snippet={snippet} />
            {isMobile && (
              <>
                <Divider my="xl" />
                <Context context={context} />
                <Divider my="xl" />
              </>
            )}
            <Controls context={context} />
          </Stack>
          {!isMobile && <Context context={context} />}
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
