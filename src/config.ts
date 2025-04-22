import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

if (!process.env.MAL_CLIENT_ID) {
  throw new Error('MAL_CLIENT_ID is required');
}

if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error('SLACK_BOT_TOKEN is required');
}

if (!process.env.SLACK_CHANNEL_ID) {
  throw new Error('SLACK_CHANNEL_ID is required');
}

const config: Config = {
  mal: {
    clientId: process.env.MAL_CLIENT_ID,
    baseUrl: 'https://api.myanimelist.net/v2'
  },
  slack: {
    token: process.env.SLACK_BOT_TOKEN,
    channelId: process.env.SLACK_CHANNEL_ID
  },
  schedule: {
    interval: '0 0 */14 * *' // Every 14 days at midnight
  },
  defaultRankingType: 'airing'
};

export default config; 