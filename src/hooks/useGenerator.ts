import { useEffect, useState } from 'react';
import { api, QuoteContextResponseData, SnippetResponseData } from '../api';
import { removeEmpty } from '../utils';

export interface GeneratorOptions {
  begin: number;
  end: number;

  extend?: number;
  offset?: number;
  resolution?: number;
  subtitles?: boolean;

  filetype?: 'mp4' | 'gif';
}

export const useGenerator = (options: GeneratorOptions) => {
  const [snippet, setSnippet] = useState<SnippetResponseData>();
  const [context, setContext] = useState<QuoteContextResponseData>();
  const [responseTime, setResponseTime] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      const snippetResponse = await api[options.filetype ?? 'gif'](
        removeEmpty({ ...options, subtitles: options.subtitles ? 1 : 0 })
      );
      if ('error' in snippetResponse) {
        console.error(snippetResponse.error);
        return;
      }

      const contextResponse = await api.context(removeEmpty(options));
      if ('error' in contextResponse) {
        console.error(contextResponse.error);
        return;
      }

      setSnippet(snippetResponse.data);
      setContext(contextResponse.data);
      setResponseTime(
        Math.max(snippetResponse.response_time, contextResponse.response_time)
      );
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(options)]);

  return { snippet, context, loading, responseTime };
};
