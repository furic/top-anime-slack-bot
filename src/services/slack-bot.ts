import { WebClient } from '@slack/web-api';
import config from '../config';
import { AnimeDetails, AnimeConfig } from '../types';

class SlackBot {
  private client: WebClient;
  private readonly animeConfig: AnimeConfig;
  private usedEmojis: Set<string>;

  constructor() {
    this.client = new WebClient(config.slack.token);
    this.animeConfig = config.anime;
    this.usedEmojis = new Set();
  }

  private getAnimeEmoji(anime: AnimeDetails): string {
    // Standard emoji fallback list
    const standardEmojis = [
      'tv', 'movie_camera', 'clapper', 'video_game', 'book', 'art', 'musical_note',
      'microphone', 'headphones', 'guitar', 'violin', 'drum', 'saxophone', 'trumpet',
      'musical_keyboard', 'musical_score', 'notes', 'studio_microphone', 'level_slider',
      'control_knobs', 'radio', 'satellite', 'satellite_antenna', 'tv', 'vhs', 'dvd',
      'camera', 'camera_with_flash', 'video_camera', 'movie_camera', 'film_projector',
      'clapper', 'film_frames', 'ticket', 'admission_tickets', 'performing_arts',
      'art', 'circus_tent', 'slot_machine', 'game_die', 'bowling', 'video_game',
      'joystick', 'slot_machine', 'game_die', 'jigsaw', 'chess_pawn', 'dart',
      'mahjong', 'clubs', 'diamonds', 'hearts', 'spades', 'black_joker', 'flower_playing_cards',
      'magnet', 'compass', 'telescope', 'microscope', 'crystal_ball', 'prayer_beads',
      'nazar_amulet', 'barber', 'alembic', 'telescope', 'microscope', 'hole', 'pill',
      'syringe', 'drop_of_blood', 'dna', 'microbe', 'petri_dish', 'test_tube',
      'thermometer', 'label', 'bookmark', 'toilet', 'shower', 'bathtub', 'mouse_trap',
      'razor', 'lotion_bottle', 'safety_pin', 'broom', 'basket', 'roll_of_paper',
      'soap', 'sponge', 'fire_extinguisher', 'shopping_cart', 'smoking', 'coffin',
      'funeral_urn', 'moyai', 'placard', 'identification_card', 'passport_control',
      'customs', 'baggage_claim', 'left_luggage', 'warning', 'children_crossing',
      'no_entry', 'prohibited', 'no_bicycles', 'no_smoking', 'no_littering',
      'non-potable_water', 'no_pedestrians', 'no_mobile_phones', 'underage',
      'radioactive', 'biohazard', 'up_arrow', 'up-right_arrow', 'right_arrow',
      'down-right_arrow', 'down_arrow', 'down-left_arrow', 'left_arrow',
      'up-left_arrow', 'up-down_arrow', 'left-right_arrow', 'right_arrow_curving_left',
      'left_arrow_curving_right', 'right_arrow_curving_up', 'right_arrow_curving_down',
      'clockwise_vertical_arrows', 'counterclockwise_arrows_button', 'BACK_arrow',
      'END_arrow', 'ON!_arrow', 'SOON_arrow', 'TOP_arrow', 'place_of_worship',
      'atom_symbol', 'om', 'star_of_david', 'wheel_of_dharma', 'yin_yang',
      'latin_cross', 'orthodox_cross', 'star_and_crescent', 'peace_symbol',
      'menorah', 'dotted_six-pointed_star', 'aries', 'taurus', 'gemini',
      'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn',
      'aquarius', 'pisces', 'ophiuchus', 'shuffle_tracks_button', 'repeat_button',
      'repeat_single_button', 'play_button', 'fast-forward_button', 'next_track_button',
      'play_or_pause_button', 'reverse_button', 'fast_reverse_button',
      'last_track_button', 'upwards_button', 'fast_up_button', 'downwards_button',
      'fast_down_button', 'pause_button', 'stop_button', 'record_button',
      'eject_button', 'cinema', 'dim_button', 'bright_button', 'antenna_bars',
      'vibration_mode', 'mobile_phone_off', 'female_sign', 'male_sign',
      'medical_symbol', 'infinity', 'recycling_symbol', 'fleur-de-lis',
      'trident_emblem', 'name_badge', 'japanese_symbol_for_beginner',
      'hollow_red_circle', 'check_mark_button', 'check_box_with_check',
      'check_mark', 'cross_mark', 'cross_mark_button', 'curly_loop',
      'double_curly_loop', 'part_alternation_mark', 'eight-spoked_asterisk',
      'eight-pointed_star', 'sparkle', 'copyright', 'registered', 'trade_mark',
      'keycap_#', 'keycap_*', 'keycap_0', 'keycap_1', 'keycap_2', 'keycap_3',
      'keycap_4', 'keycap_5', 'keycap_6', 'keycap_7', 'keycap_8', 'keycap_9',
      'keycap_10'
    ];

    // First try to get emoji from genres
    const genreEmoji = anime.genres?.find(genre => {
      const genreConfig = this.animeConfig.anime.find(g => g.name === genre.name);
      return genreConfig?.emojiName && !this.usedEmojis.has(genreConfig.emojiName);
    });
    
    if (genreEmoji) {
      const genreConfig = this.animeConfig.anime.find(g => g.name === genreEmoji.name);
      if (genreConfig?.emojiName) {
        this.usedEmojis.add(genreConfig.emojiName);
        return genreConfig.emojiName;
      }
    }

    // If no genre match, try to determine from synopsis
    const synopsis = anime.synopsis.toLowerCase();
    
    // Check for common themes in synopsis
    const themeEmojis = [
      { keywords: ['school', 'student'], emoji: 'school' },
      { keywords: ['music', 'band', 'sing'], emoji: 'musical_note' },
      { keywords: ['sport', 'game', 'competition'], emoji: 'soccer' },
      { keywords: ['magic', 'witch', 'wizard'], emoji: 'sparkles' },
      { keywords: ['robot', 'mecha', 'machine'], emoji: 'robot' },
      { keywords: ['space', 'planet', 'galaxy'], emoji: 'rocket' },
      { keywords: ['vampire', 'demon', 'monster'], emoji: 'ghost' },
      { keywords: ['samurai', 'sword', 'ninja'], emoji: 'crossed_swords' },
      { keywords: ['military', 'war', 'battle'], emoji: 'medal' },
      { keywords: ['historical', 'period', 'era'], emoji: 'classical_building' }
    ];

    for (const theme of themeEmojis) {
      if (theme.keywords.some(keyword => synopsis.includes(keyword)) && !this.usedEmojis.has(theme.emoji)) {
        this.usedEmojis.add(theme.emoji);
        return theme.emoji;
      }
    }

    // Try rating-based emojis
    const ratingEmojis = {
      'G': 'baby',
      'PG': 'boy',
      'PG-13': 'man',
      'R': 'underage',
      'R+': 'underage'
    };

    const ratingEmoji = ratingEmojis[anime.rating as keyof typeof ratingEmojis];
    if (ratingEmoji && !this.usedEmojis.has(ratingEmoji)) {
      this.usedEmojis.add(ratingEmoji);
      return ratingEmoji;
    }

    // If all else fails, use a random standard emoji that hasn't been used yet
    const availableEmojis = standardEmojis.filter(emoji => !this.usedEmojis.has(emoji));
    if (availableEmojis.length > 0) {
      const randomEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
      this.usedEmojis.add(randomEmoji);
      return randomEmoji;
    }

    // If all emojis are used, reset the used emojis set and start over
    this.usedEmojis.clear();
    const randomEmoji = standardEmojis[Math.floor(Math.random() * standardEmojis.length)];
    this.usedEmojis.add(randomEmoji);
    return randomEmoji;
  }

  public formatAnimeMessage(animeList: AnimeDetails[]): string {
    const randomMessage = this.animeConfig.messages[Math.floor(Math.random() * this.animeConfig.messages.length)];
    const header = `*${randomMessage}*\n\n`;
    const animeEntries = animeList.map((anime, index) => {
      const emoji = this.getAnimeEmoji(anime);
      const mediaType = (anime.media_type || 'Unknown').toUpperCase();
      const episodes = anime.num_episodes ? ` (${anime.num_episodes} eps)` : '';
      const season = anime.start_season ? `${anime.start_season.year} ${anime.start_season.season.charAt(0).toUpperCase() + anime.start_season.season.slice(1)}` : 'TBA';
      const title = anime.alternative_titles?.ja ? `${anime.title} (${anime.alternative_titles.ja})` : anime.title;
      return `${index + 1}. :${emoji}: *${title}* | ${mediaType}${episodes} | ${season}\n`;
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