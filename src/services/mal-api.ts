import axios from 'axios';
import { MALConfig, AnimeDetails, RankingType, Genre } from '../types';

interface MALAnimeResponse {
  id: number;
  title: string;
  synopsis: string;
  genres: Array<{ id: number; name: string }>;
  rating: string;
  mean: number;
  media_type: string;
  num_episodes: number;
  start_season: {
    year: number;
    season: string;
  };
}

interface MALRankingResponse {
  data: Array<{
    node: MALAnimeResponse;
  }>;
}

export class MALApi {
  private config: MALConfig;

  constructor(config: MALConfig) {
    this.config = config;
  }

  private async fetchAnimeDetails(animeId: number): Promise<AnimeDetails> {
    const response = await axios.get<MALAnimeResponse>(`${this.config.baseUrl}/anime/${animeId}`, {
      headers: {
        'X-MAL-CLIENT-ID': this.config.clientId,
      },
      params: {
        fields: 'id,title,synopsis,genres,rating,mean',
      },
    });

    const data = response.data;
    return {
      id: data.id,
      title: data.title,
      synopsis: data.synopsis,
      genres: data.genres.map(genre => ({ id: genre.id, name: genre.name } as Genre)),
      rating: data.rating,
      mean: data.mean,
    };
  }

  async getTopAnime(rankingType: RankingType = 'airing', limit: number = 10): Promise<AnimeDetails[]> {
    const response = await axios.get<MALRankingResponse>(`${this.config.baseUrl}/anime/ranking`, {
      headers: {
        'X-MAL-CLIENT-ID': this.config.clientId,
      },
      params: {
        ranking_type: rankingType,
        limit,
        fields: 'id,title,synopsis,genres,rating,mean',
      },
    });

    const animeList = response.data.data;
    const detailedAnimeList: AnimeDetails[] = [];

    for (const anime of animeList) {
      try {
        const details = await this.fetchAnimeDetails(anime.node.id);
        detailedAnimeList.push(details);
      } catch (error) {
        console.error(`Failed to fetch details for anime ${anime.node.id}:`, error);
      }
    }

    return detailedAnimeList;
  }

  async getAnimeDetails(animeId: number): Promise<AnimeDetails> {
    try {
      const response = await axios.get<MALAnimeResponse>(`${this.config.baseUrl}/anime/${animeId}`, {
        headers: {
          'X-MAL-CLIENT-ID': this.config.clientId,
        },
        params: {
          fields: 'id,title,synopsis,genres,rating,mean,media_type,num_episodes,start_season'
        }
      });
      const data = response.data;
      return {
        id: data.id,
        title: data.title,
        synopsis: data.synopsis,
        genres: data.genres.map(genre => ({ id: genre.id, name: genre.name } as Genre)),
        rating: data.rating,
        mean: data.mean,
        media_type: data.media_type,
        num_episodes: data.num_episodes,
        start_season: data.start_season ? {
          year: data.start_season.year,
          season: data.start_season.season
        } : undefined
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching details for anime ${animeId}:`, error.message);
      }
      throw error;
    }
  }

  async getTopAiringAnimeWithDetails(limit: number = 10): Promise<AnimeDetails[]> {
    try {
      const animeList = await this.getTopAnime('airing', limit);
      return animeList;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching anime with details:', error.message);
      }
      throw error;
    }
  }
}

export default new MALApi({
  clientId: process.env.MAL_CLIENT_ID || '',
  baseUrl: 'https://api.myanimelist.net/v2',
}); 