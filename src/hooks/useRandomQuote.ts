import { useEffect, useState } from 'react';
import { api } from '../api';
import { randomQuote } from '../random-quote';

let inflight = false;

export const useRandomQuote = () => {
  const [quote, setQuote] = useState<string[]>();
  const [snap, setSnap] = useState<string>();
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (inflight) {
      return;
    }
    inflight = true;
    setLoading(true);
    const response = await api.randomSnippet();
    if ('error' in response) {
      setQuote([randomQuote()]);
      return;
    }

    setQuote(response.data.result.subtitles.map((subtitle) => subtitle.text));
    setSnap(response.data.result.snapshot);
    setLoading(false);

    inflight = false;
  };

  useEffect(() => {
    fetch();
  }, []);

  return { quote, snap, loading, fetch };
};
