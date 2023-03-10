import { MetaBundle } from './api';

export const removeEmpty = <T extends Record<string, any>>(obj: T): T =>
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

export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const download = (url: string) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (this.status === 200) {
      var blob = new Blob([this.response], {
        type: 'application/octet-stream',
      });
      var downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = url.substring(url.lastIndexOf('/') + 1);
      downloadLink.click();
    }
  };

  xhr.send();
};
