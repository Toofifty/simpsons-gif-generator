import { MetaBundle } from './api';

export const removeEmpty = <T extends Record<any, any>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== undefined && !(typeof value === 'number' && isNaN(value))
    )
  ) as T;

export const episodeIdentifier = (meta: MetaBundle) =>
  `S${(meta.season_number + '').padStart(2, '0')}E${(
    meta.episode_in_season + ''
  ).padStart(2, '0')}`;
