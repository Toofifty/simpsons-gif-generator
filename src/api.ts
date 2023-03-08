export interface APIResponse<T> {
  status: 200;
  response_time: number;
  data: T;
}

export interface APIError {
  status: number;
  response_time: number;
  error: string;
}

export interface MetaBundle {
  season_number: number;
  season_title: string;
  episode_title: string;
  episode_number: number;
  episode_in_season: number;
}

export interface Subtitle {
  id: number;
  episode_id: number;
  time_begin: string;
  time_end: string;
  text: string;
}

export interface StatsResponseData {
  episodes_indexed: number;
  seasons_indexed: number;
  subtitles_indexed: number;
  jpgs_generated: number;
  mp4s_generated: number;
  gifs_generated: number;
}

export interface QuoteContextRequest {
  begin: number;
  end: number;
  padding?: string;
}

export interface QuoteContextResponseData {
  meta: MetaBundle;
  matches: {
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
  };
}

export interface SearchQuoteRequest {
  term: string;
}

export interface SearchQuoteResponseData {
  total_results: number;
  matches: {
    meta: MetaBundle;
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
  }[];
}

export interface SnippetRequest {
  begin: number;
  end: number;
  extend?: number;
  offset?: number;
  resolution?: number;
  subtitles?: number;
}

export interface SnippetResponseData {
  url: string;
  render_time: number;
  cached: boolean;
}

export const api = {
  async get<Req extends Record<string, any>, Res>(
    endpoint: string,
    query?: Req
  ): Promise<APIResponse<Res> | APIError> {
    const params = new URLSearchParams(query);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}?${params.toString()}`
    );
    return await res.json();
  },

  stats() {
    return this.get<{}, StatsResponseData>('');
  },

  context(options: QuoteContextRequest) {
    return this.get<QuoteContextRequest, QuoteContextResponseData>(
      'context',
      options
    );
  },

  search(options: SearchQuoteRequest) {
    return this.get<SearchQuoteRequest, SearchQuoteResponseData>(
      'search',
      options
    );
  },

  gif(options: SnippetRequest) {
    return this.get<SnippetRequest, SnippetResponseData>('gif', options);
  },

  mp4(options: SnippetRequest) {
    return this.get<SnippetRequest, SnippetResponseData>('mp4', options);
  },
};
