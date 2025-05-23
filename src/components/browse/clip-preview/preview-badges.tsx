import { ActionIcon, Badge, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconCopy, IconEye } from '@tabler/icons-react';

const f = Intl.NumberFormat('en-US');

interface PreviewBadgesProps {
  views: number;
  copies: number;
}

export const PreviewBadges = ({ views, copies }: PreviewBadgesProps) => (
  <Group spacing="0">
    <Tooltip label="Views">
      <Badge variant="" radius="md">
        <Flex gap="xs" align="center">
          <IconEye size={12} />
          <Text sx={{ userSelect: 'none' }}>{f.format(views)}</Text>
        </Flex>
      </Badge>
    </Tooltip>
    <Tooltip label="Copies">
      <Badge variant="" radius="md">
        <Flex gap="xs" align="center">
          <IconCopy size={12} />
          <Text sx={{ userSelect: 'none' }}>{f.format(copies)}</Text>
        </Flex>
      </Badge>
    </Tooltip>
  </Group>
);
