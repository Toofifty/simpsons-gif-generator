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
  clip_matches: {
    clip: {
      uuid: string;
      subtitleBegin: number;
      subtitleEnd: number;
      offset: number;
      extend: number;
      views: number;
      copies: number;
    };
    meta: MetaBundle;
    lines: Subtitle[];
    thumbnail: string;
  }[];
}

export interface ClipRequest {
  begin: number;
  end: number;
  extend?: number;
  offset?: number;
  resolution?: number;
  subtitles?: number;
}

export interface ClipResponseData {
  url: string;
  clip_uuid: string;
  generation_uuid: string;
  render_time: number;
  subtitle_correction: number;
  cached: boolean;
  clip_views: number;
  clip_copies: number;
  generation_views: number;
  generation_copies: number;
  subtitles?: { id: number; text: string }[];
}

export interface ClipsRequest {
  filetype: string;
  sort_by?: 'views' | 'created_at' | 'episode_id';
  order?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  ['filter_by.episode']?: number;
  ['filter_by.episode.season']?: number;
}

export interface ClipsResponseData {
  results: Clip[];
  count: number;
}

export interface EpisodeCorrectionRequest {
  id: number;
  passcode: string;
  correction: number;
}

export interface Episode {
  id: number;
  seasonId: number;
  idInSeason: number;
  identifier: string;
  title: string;
  subtitleCorrection: number;
}

export interface EpisodeCorrectionResponseData {
  message: string;
}

export interface Clip {
  clip_uuid: string;
  generation_uuid: string;
  options: {
    begin: number;
    end: number;
    offset: number;
    extend: number;
  };
  episode_id: number;
  snapshot: string;
  url: string;
  views: number;
  copies: number;
  subtitles: { id: number; text: string }[];
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

export interface TrackCopyRequest {
  uuid: string;
}

export const api = {
  async get<Req extends Record<string, any>, Res>(
    endpoint: string,
    query?: Req
  ): Promise<APIResponse<Res> | APIError> {
    const params = new URLSearchParams(query && removeEmpty(query));
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}?${params.toString()}`,
      { headers: { 'x-simpsons-frontend': 'true' } }
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

  gif(options: ClipRequest) {
    return this.get<ClipRequest, ClipResponseData>('gif', options);
  },

  mp4(options: ClipRequest) {
    return this.get<ClipRequest, ClipResponseData>('mp4', options);
  },

  episodes() {
    return this.get<{}, Episode[]>('episode');
  },

  correction(options: EpisodeCorrectionRequest) {
    return this.post<EpisodeCorrectionRequest, EpisodeCorrectionResponseData>(
      'episode/correction',
      options
    );
  },

  clips(options: ClipsRequest) {
    return this.get<ClipsRequest, ClipsResponseData>('clips', options);
  },

  randomClip() {
    return this.get<{}, ClipResponseData>('clips/random', {
      resolution: 360,
    });
  },

  trackCopy(options: TrackCopyRequest) {
    return this.get<TrackCopyRequest, {}>('generations/track-copy', options);
  },
};
