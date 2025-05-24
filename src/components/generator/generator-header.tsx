import {
  Badge,
  Button,
  Flex,
  Group,
  Skeleton,
  useMantineTheme,
} from '@mantine/core';
import { MetaBundle } from '../../api';
import { EpisodeTitle, getIdentifier } from '../episode-title';
import { NavLink } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export const GeneratorHeader = ({ meta }: { meta: MetaBundle }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Flex gap="xl" justify="space-between" wrap="wrap-reverse">
      <EpisodeTitle
        identifier={getIdentifier(meta.season_number, meta.episode_number)}
        title={meta.episode_title}
      />
      <Button
        variant="default"
        color="gray"
        rightIcon={<IconChevronRight />}
        component={NavLink}
        to={`/browse/season/${meta.season_number}`}
        fullWidth={isMobile}
      >
        Browse season {meta.season_number}
      </Button>
    </Flex>
  );
};

export const GeneratorHeaderPlaceholder = () => (
  <Flex gap="sm" justify="space-between">
    <Group align="center">
      <Skeleton width={65} height={20} radius="lg" />
      <Skeleton width={100} height={20} radius="lg" />
    </Group>
    <Skeleton width={150} height={36} />
  </Flex>
);
