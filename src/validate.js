const token = (githubToken, discordToken) => {
  if (githubToken === undefined || githubToken === null) {
    console.log('GITHUB_API_TOKEN environment variable is required for this bot to successfully start');
    process.exit(1);
  }
  if (discordToken === undefined || discordToken === null) {
    console.log('DISCORD_API_TOKEN environment variable is required for this bot to successfully start');
    process.exit(1);
  }
};

const bot = (githubOrgName, botName) => {
  if (githubOrgName === undefined || githubOrgName === null) {
    console.log('GITHUB_ORG_NAME environment variable not supplied, defaulting to "tory-toolkit"');
  }
  if (botName === undefined || botName === null) {
    console.log('BOT_NAME environment variable not supplied, defaulting to "orgbot"');
  }
}

module.exports = {
  token,
  bot,
};
