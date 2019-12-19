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

module.exports = {
  token
};
