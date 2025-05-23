import { useEffect, useState } from 'react';
import { ClipResponseData, api } from '../api';
import { randomQuote } from '../random-quote';
import { runTransition } from '../util/with-transition';

let inflight = false;

export const useRandomClip = () => {
  const [quote, setQuote] = useState<string[]>();
  const [loading, setLoading] = useState(false);

  const [clip, setClip] = useState<ClipResponseData>();

  const fetch = async () => {
    if (inflight) {
      return;
    }
    inflight = true;
    setLoading(true);
    const response = await api.randomClip();
    if ('error' in response) {
      setQuote([randomQuote()]);
      return;
    }

    runTransition(() => {
      setClip(response.data);
      setQuote(response.data.subtitles?.map((subtitle) => subtitle.text));
      setLoading(false);
    });

    inflight = false;
  };

  useEffect(() => {
    fetch();
  }, []);

  return { quote, clip, loading, fetch };
};
