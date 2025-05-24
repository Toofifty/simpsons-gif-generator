import { Badge, Button, Flex, Group, Skeleton } from '@mantine/core';
import { MetaBundle } from '../../api';
import { EpisodeTitle, getIdentifier } from '../episode-title';
import { NavLink } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';

export const GeneratorHeader = ({ meta }: { meta: MetaBundle }) => (
  <Flex gap="sm" justify="space-between">
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
    >
      Browse season {meta.season_number}
    </Button>
  </Flex>
);

export const GeneratorHeaderPlaceholder = () => (
  <Flex gap="sm" justify="space-between">
    <Group align="center">
      <Skeleton width={65} height={20} radius="lg" />
      <Skeleton width={100} height={20} radius="lg" />
    </Group>
    <Skeleton width={150} height={36} />
  </Flex>
);
