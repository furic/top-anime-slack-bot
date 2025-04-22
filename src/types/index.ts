export interface MALConfig {
  clientId: string;
  baseUrl: string;
}

export interface SlackConfig {
  token: string;
}

export interface Config {
  mal: MALConfig;
  slack: SlackConfig;
  schedule: {
    interval: string;
  };
  defaultRankingType: RankingType;
}

export type RankingType = 
  | 'all'
  | 'airing'
  | 'upcoming'
  | 'tv'
  | 'ova'
  | 'movie'
  | 'special'
  | 'bypopularity'
  | 'favorite';

export interface MainPicture {
  medium: string;
  large: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Anime {
  id: number;
  title: string;
  main_picture?: MainPicture;
  mean?: number;
  num_episodes?: number;
  media_type?: string;
  start_season?: {
    year: number;
    season: string;
  };
  synopsis?: string;
  genres?: Genre[];
  rating?: string;
}

export interface MALResponse {
  data: {
    node: Anime;
    ranking: {
      rank: number;
    };
  }[];
}

export interface AnimeDetails {
  id: number;
  title: string;
  synopsis: string;
  genres: Genre[];
  rating: string;
  mean: number;
}

export interface SlashCommandPayload {
  token: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  user_id: string;
  user_name: string;
  channel_id: string;
  channel_name: string;
  team_id: string;
  team_domain: string;
  enterprise_id?: string;
  enterprise_name?: string;
}

export interface AnimeConfig {
  messages: string[];
  anime: Array<{
    name: string;
    emoji: string;
    emojiUnicode: string;
    emojiName: string;
    description: string;
  }>;
  channel: string;
}
