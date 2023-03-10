import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useGenerator } from '../../hooks/useGenerator';
import { Context } from './context';
import { Controls } from './controls';
import { Viewer } from './viewer';

export const GeneratorPanel = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { context, snippet, loading, responseTime } = useGenerator();

  const [mobileContextOpen, { toggle: toggleMobileContext }] =
    useDisclosure(false);

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
          mah={isMobile ? undefined : 800}
          direction={isMobile ? 'column' : undefined}
        >
          <Stack>
            <Viewer loading={loading} snippet={snippet} />
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
                    mobileContextOpen ? <IconChevronUp /> : <IconChevronDown />
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
  );
};
