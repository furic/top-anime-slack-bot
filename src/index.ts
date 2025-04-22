import schedule from 'node-schedule';
import malApi from './services/mal-api';
import slackBot from './services/slack-bot';
import config from './config';

async function updateAnimeList(): Promise<void> {
  try {
    const animeList = await malApi.getTopAiringAnimeWithDetails();
    await slackBot.postAnimeUpdate(animeList);
    console.log('Successfully posted anime update to Slack');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating anime list:', error.message);
    }
  }
}

// Schedule regular updates
void schedule.scheduleJob(config.schedule.interval, () => {
  void updateAnimeList();
});

// Run immediately on startup
void updateAnimeList();

console.log('Bot started successfully!'); 