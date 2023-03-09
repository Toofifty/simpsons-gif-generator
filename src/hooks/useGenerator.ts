import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { api, QuoteContextResponseData, SnippetResponseData } from '../api';
import { assert, removeEmpty } from '../utils';
import {
  GenerationOptions,
  isValid,
  useGenerationOptions,
} from './useGenerationOptions';

export const useGenerator = () => {
  const { options } = useGenerationOptions();
  assert(isValid(options));

  const [snippet, setSnippet] = useState<SnippetResponseData>();
  const [context, setContext] = useState<QuoteContextResponseData>();
  const [responseTime, setResponseTime] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      const contextResponse = await api.context(removeEmpty(options));
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

      const snippetResponse = await api[options.filetype ?? 'gif'](
        removeEmpty({ ...options, subtitles: options.subtitles ? 1 : 0 })
      );
      if ('error' in snippetResponse) {
        notifications.show({
          title: 'Error generating snippet',
          message: snippetResponse.error,
          color: 'red',
          autoClose: false,
        });
        return;
      }

      setSnippet(snippetResponse.data);
      setResponseTime(
        Math.max(snippetResponse.response_time, contextResponse.response_time)
      );
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(options)]);

  return { snippet, context, loading, responseTime };
};
