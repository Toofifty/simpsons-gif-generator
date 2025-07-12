import { CSSObject, MantineTheme } from '@mantine/core';

export const scrollbarStyle = (theme: MantineTheme): CSSObject => ({
  scrollbarColor: `${theme.colors.gray[5]} transparent`,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
});
