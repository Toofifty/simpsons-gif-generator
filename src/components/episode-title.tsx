import { Badge, Group, MantineStyleSystemProps, Title } from '@mantine/core';

export const getIdentifier = (seasonId: number, episodeId: number) => {
  const season = seasonId.toString().padStart(2, '0');
  const episode = episodeId.toString().padStart(2, '0');
  return `S${season}E${episode}`;
};

export const EpisodeTitle = ({
  identifier,
  title,
  ...props
}: {
  identifier: string;
  title: string;
} & MantineStyleSystemProps) => (
  <Group align="center" {...props}>
    <Badge variant="filled">{identifier.toUpperCase()}</Badge>
    <Title size="medium">{title}</Title>
  </Group>
);
