import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { api, QuoteContextResponseData, ClipResponseData } from '../api';
import { assert, removeEmpty } from '../utils';
import { isValid } from './useGenerationOptions';
import { useOptionsContext } from './useOptionsContext';

export const useGenerator = () => {
  const { options } = useOptionsContext();
  assert(isValid(options));

  const [renderIndex, rerender] = useState(0);
  const [clip, setClip] = useState<ClipResponseData>();
  const [context, setContext] = useState<QuoteContextResponseData>();
  const [responseTime, setResponseTime] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let discarded = false;

    (async () => {
      setLoading(true);
      const contextResponse = await api.context(removeEmpty(options));
      if (discarded) {
        return;
      }

      if ('error' in contextResponse) {
        notifications.show({
          title: 'Error fetching quote context',
          message: contextResponse.error,
          color: 'red',
          autoClose: false,
        });
        return;
      }
      setContext(contextResponse.data);

      const clipResponse = await api[options.filetype ?? 'gif'](
        removeEmpty({ ...options, subtitles: options.subtitles ? 1 : 0 })
      );
      if ('error' in clipResponse) {
        notifications.show({
          title: 'Error generating clip',
          message: clipResponse.error,
          color: 'red',
          autoClose: false,
        });
        return;
      }

      setClip(clipResponse.data);
      setResponseTime(
        Math.max(clipResponse.response_time, contextResponse.response_time)
      );
      setLoading(false);
    })();
    return () => {
      discarded = true;
    };
  }, [JSON.stringify(options), renderIndex]);

  const invalidate = () => rerender((i) => i + 1);

  return { clip, context, loading, responseTime, invalidate };
};
