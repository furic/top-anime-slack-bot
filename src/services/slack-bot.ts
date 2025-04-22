import { WebClient } from '@slack/web-api';
import config from '../config';
import animeConfig from '../config.json';
import { AnimeDetails, AnimeConfig } from '../types';

class SlackBot {
  private client: WebClient;
  private readonly animeConfig: AnimeConfig;

  constructor() {
    this.client = new WebClient(config.slack.token);
    this.animeConfig = animeConfig as AnimeConfig;
  }

  private getAnimeEmoji(anime: AnimeDetails): string {
    // First try to get emoji from genres
    const genreEmoji = anime.genres?.find(genre => {
      const genreConfig = this.animeConfig.anime.find(g => g.name === genre.name);
      return genreConfig?.emojiName;
    });
    
    if (genreEmoji) {
      const genreConfig = this.animeConfig.anime.find(g => g.name === genreEmoji.name);
      return genreConfig?.emojiName || 'tv'; // 📺
    }

    // If no genre match, try to determine from synopsis
    const synopsis = anime.synopsis.toLowerCase();
    
    // Check for common themes in synopsis
    if (synopsis.includes('school') || synopsis.includes('student')) {
      return 'school'; // 🏫
    }
    if (synopsis.includes('music') || synopsis.includes('band') || synopsis.includes('sing')) {
      return 'musical_note'; // 🎵
    }
    if (synopsis.includes('sport') || synopsis.includes('game') || synopsis.includes('competition')) {
      return 'soccer'; // ⚽
    }
    if (synopsis.includes('magic') || synopsis.includes('witch') || synopsis.includes('wizard')) {
      return 'sparkles'; // ✨
    }
    if (synopsis.includes('robot') || synopsis.includes('mecha') || synopsis.includes('machine')) {
      return 'robot'; // 🤖
    }
    if (synopsis.includes('space') || synopsis.includes('planet') || synopsis.includes('galaxy')) {
      return 'rocket'; // 🚀
    }
    if (synopsis.includes('vampire') || synopsis.includes('demon') || synopsis.includes('monster')) {
      return 'ghost'; // 👻
    }
    if (synopsis.includes('samurai') || synopsis.includes('sword') || synopsis.includes('ninja')) {
      return 'crossed_swords'; // ⚔️
    }
    if (synopsis.includes('military') || synopsis.includes('war') || synopsis.includes('battle')) {
      return 'medal'; // 🎖️
    }
    if (synopsis.includes('historical') || synopsis.includes('period') || synopsis.includes('era')) {
      return 'classical_building'; // 🏛️
    }

    // Default emoji based on rating
    switch (anime.rating) {
      case 'G':
        return 'baby'; // 👶
      case 'PG':
        return 'boy'; // 👦
      case 'PG-13':
        return 'man'; // 👨
      case 'R':
        return 'underage'; // 🔞
      case 'R+':
        return 'underage'; // 🔞
      default:
        return 'tv'; // 📺
    }
  }

  private formatAnimeMessage(animeList: AnimeDetails[]): string {
    const randomMessage = this.animeConfig.messages[Math.floor(Math.random() * this.animeConfig.messages.length)];
    const header = `*${randomMessage}*\n\n`;
    const animeEntries = animeList.map((anime, index) => {
      const emoji = this.getAnimeEmoji(anime);
      const rating = anime.mean ? `Rating: ⭐ ${anime.mean}` : 'Rating: N/A';
      const genres = anime.genres?.map(g => g.name).join(', ') || 'Unknown';
      return `${index + 1}. ${emoji} *${anime.title}*\n${rating} | Genres: ${genres}\n`;
    }).join('\n');

    return `${header}${animeEntries}\n_React with an emoji to show which shows you're watching!_`;
  }

  private async addReactions(channel: string, ts: string, animeList: AnimeDetails[]): Promise<void> {
    try {
      for (const anime of animeList) {
        const emoji = this.getAnimeEmoji(anime);
        await this.client.reactions.add({
          channel,
          timestamp: ts,
          name: emoji.replace(/[^\w\s]/g, '') // Remove any non-alphanumeric characters
        });
      }
    } catch (error) {
      console.error('Error adding reactions:', error);
    }
  }

  async postAnimeUpdate(animeList: AnimeDetails[]): Promise<void> {
    try {
      const result = await this.client.chat.postMessage({
        channel: this.animeConfig.channel,
        text: this.formatAnimeMessage(animeList),
        unfurl_links: false
      });

      if (result.ok && result.ts && result.channel) {
        await this.addReactions(result.channel, result.ts, animeList);
      } else {
        console.error('Failed to get message timestamp or channel:', result);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error posting to Slack:', error.message);
      }
      throw error;
    }
  }
}

export default new SlackBot(); 