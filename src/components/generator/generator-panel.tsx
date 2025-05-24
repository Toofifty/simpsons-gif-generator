import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Paper,
  Skeleton,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useGenerator } from '../../hooks/useGenerator';
import { GeneratorContext } from '../../hooks/useGeneratorContext';
import { Context, ContextPlaceholder } from './context';
import { Controls, ControlsPlaceholder } from './controls';
import { Viewer, ViewerPlaceholder } from './viewer';
import {
  GeneratorHeader,
  GeneratorHeaderPlaceholder,
} from './generator-header';
import { useState } from 'react';

export const GeneratorPanel = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { context, clip, loading, responseTime, invalidate } = useGenerator();

  const [mobileContextOpen, { toggle: toggleMobileContext }] =
    useDisclosure(false);

  return (
    <GeneratorContext.Provider
      value={{ context, clip, loading, responseTime, invalidate }}
    >
      <Box mx="auto" maw="800px">
        <Paper
          withBorder
          p="xl"
          my="xl"
          style={{ viewTransitionName: 'main-panel' }}
        >
          {context ? (
            <GeneratorHeader meta={context.meta} />
          ) : (
            <GeneratorHeaderPlaceholder />
          )}
          <Flex
            my="lg"
            h={isMobile ? undefined : 800}
            direction={isMobile ? 'column' : undefined}
          >
            <Stack>
              {clip ? (
                <Viewer loading={false} clip={clip} />
              ) : (
                <ViewerPlaceholder />
              )}
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
                    {context && mobileContextOpen ? (
                      <Context context={context} />
                    ) : (
                      <ContextPlaceholder />
                    )}
                    <Divider my="xl" />
                  </Collapse>
                </>
              )}
              {context ? (
                <Controls context={context} />
              ) : (
                <ControlsPlaceholder />
              )}
            </Stack>
            {!isMobile &&
              (context ? (
                <Context ml="lg" context={context} />
              ) : (
                <ContextPlaceholder ml="lg" />
              ))}
          </Flex>
          {context && !!responseTime ? (
            <Text fz="sm" color="dimmed">
              Generated in {responseTime}ms
            </Text>
          ) : (
            <Skeleton width={120} height={20} radius="lg" />
          )}
        </Paper>
      </Box>
    </GeneratorContext.Provider>
  );
};
