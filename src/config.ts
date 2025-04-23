import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

if (!process.env.MAL_CLIENT_ID) {
  throw new Error('MAL_CLIENT_ID is required');
}

if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error('SLACK_BOT_TOKEN is required');
}

const config: Config = {
  mal: {
    clientId: process.env.MAL_CLIENT_ID,
    baseUrl: 'https://api.myanimelist.net/v2'
  },
  slack: {
    token: process.env.SLACK_BOT_TOKEN
  },
  schedule: {
    interval: '0 0 */14 * *' // Every 14 days at midnight
  },
  defaultRankingType: 'airing',
  anime: {
    messages: ['Check out these top airing anime!'],
    anime: [
      {
        name: 'Action',
        emoji: '⚔️',
        emojiUnicode: '⚔️',
        emojiName: 'crossed_swords',
        description: 'Action anime'
      },
      {
        name: 'Adventure',
        emoji: '🌟',
        emojiUnicode: '🌟',
        emojiName: 'star',
        description: 'Adventure anime'
      }
    ],
    channel: 'social-anime'
  }
};

export default config; 