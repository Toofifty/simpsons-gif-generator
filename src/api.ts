import { removeEmpty } from './utils';

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
  subtitle_correction?: number;
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
  offset?: number;
  limit?: number;
}

export interface SearchQuoteResponseData {
  total_results: number;
  offset: number;
  limit: number;
  remaining: number;
  matches: {
    meta: MetaBundle;
    before: Subtitle[];
    lines: Subtitle[];
    after: Subtitle[];
    thumbnail: string;
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
  uuid: string;
  published: boolean;
  render_time: number;
  cached: boolean;
}

export interface EpisodeCorrectionRequest {
  id: number;
  passcode: string;
  correction: number;
}

export interface EpisodeCorrectionResponseData {
  message: string;
}

export interface Snippet {
  uuid: string;
  url: string;
  snapshot: string;
  episode: { id: number };
  published: boolean;
  options: SnippetRequest & { filetype: 'mp4' | 'gif' | 'webm' };
  views: number;
  createdAt: string;
  updatedAt: string;
  subtitles: { id: number; text: string }[];
}

export interface SnippetsRequest {
  offset?: number;
  limit?: number;
}

export interface SnippetsResponseData {
  results: Snippet[];
  count: number;
}

export interface RandomSnippetResponse {
  result: Snippet;
}

export interface SnippetPublishRequest {
  uuid: string;
}

export interface SnippetPublishResponseData {
  message: string;
}

export interface LogsRequest {
  filter?: string;
  offset?: number;
  limit: number;
}

export interface LogsResponseData {
  total: number;
  logs: {
    id: number;
    createdAt: string;
    status: number;
    requestPath: string;
    body: string;
    success: boolean;
    responseTime: number;
    renderTime?: number;
  }[];
}

export const api = {
  async get<Req extends Record<string, any>, Res>(
    endpoint: string,
    query?: Req
  ): Promise<APIResponse<Res> | APIError> {
    const params = new URLSearchParams(query && removeEmpty(query));
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}?${params.toString()}`
    );
    return await res.json();
  },

  async post<Req extends Record<string, any>, Res>(
    endpoint: string,
    body: Req
  ): Promise<APIResponse<Res> | APIError> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await res.json();
  },

  stats() {
    return this.get<{}, StatsResponseData>('');
  },

  logs(options: LogsRequest) {
    return this.get<LogsRequest, LogsResponseData>('logs', options);
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

  correction(options: EpisodeCorrectionRequest) {
    return this.post<EpisodeCorrectionRequest, EpisodeCorrectionResponseData>(
      'episode/correction',
      options
    );
  },

  snippets(options: SnippetsRequest) {
    return this.get<SnippetsRequest, SnippetsResponseData>('snippets', options);
  },

  randomSnippet() {
    return this.get<{}, RandomSnippetResponse>('snippets/random');
  },

  publish(uuid: string) {
    return this.post<SnippetPublishRequest, SnippetPublishResponseData>(
      'snippets/publish',
      { uuid }
    );
  },
};
