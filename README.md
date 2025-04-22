# Top Anime Slack Bot

A Slack bot that shares top anime rankings from MyAnimeList. Users can choose from various ranking types including currently airing, upcoming, all-time favorites, and more!

## Features

- Fetches top anime rankings from MyAnimeList API
- Supports multiple ranking types:
  - `airing`: Currently airing anime
  - `upcoming`: Upcoming anime
  - `all`: All-time top anime
  - `tv`: Top TV series
  - `movie`: Top movies
  - `bypopularity`: Most popular
  - `favorite`: Most favorited
- Posts updates to a Slack channel every Monday at 10:30 AM UTC
- Includes anime titles, ratings, and genre information
- Adds relevant emojis to each anime entry
- Allows users to react with emojis to show what they're watching
- Slash command support: `/topanime [ranking_type]`

## Prerequisites

- Node.js (v20 or higher)
- A Slack workspace with admin permissions
- MyAnimeList API Client ID (obtain from https://myanimelist.net/apiconfig)
- Slack Bot Token with necessary permissions

## Setup

1. **MyAnimeList API Setup**
   - Go to https://myanimelist.net/apiconfig
   - Create a new API client
   - Get your Client ID
   - No callback URL is needed as we're using client authentication

2. **Slack App Setup**
   - Go to https://api.slack.com/apps
   - Create a New App using the provided manifest.json
   - Install the app to your workspace
   - Copy the Bot User OAuth Token

3. **Environment Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/furic/top-anime-slack-bot.git
   cd top-anime-slack-bot

   # Install dependencies
   npm install

   # Copy the example environment file
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   Edit the `.env` file and add your credentials:
   ```
   MAL_CLIENT_ID=your_mal_client_id
   SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
   ```

## Usage

### Automatic Updates
- The bot will post updates every Monday at 10:30 AM UTC automatically
- Each anime entry will have a relevant emoji
- Users can react to the messages with emojis to indicate which shows they're watching

### Slash Commands
Use the `/topanime` command to get immediate rankings:
- `/topanime` - Shows top airing anime (default)
- `/topanime airing` - Shows currently airing anime
- `/topanime upcoming` - Shows upcoming anime
- `/topanime all` - Shows all-time top anime
- `/topanime tv` - Shows top TV series
- `/topanime movie` - Shows top movies
- `/topanime bypopularity` - Shows most popular anime
- `/topanime favorite` - Shows most favorited anime

## Development

To run locally:
```bash
npm install
npm start
```

To test:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
