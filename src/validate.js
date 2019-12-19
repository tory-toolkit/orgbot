const token = (token) => {
  if (token === undefined || token === null) {
    console.log('DISCORD_API_TOKEN environment variable is required for this bot to successfully start');
    process.exit(1);
  }
}

module.exports = {
  token
}
