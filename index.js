const Http = require('http');
const httpPort = 3838;

const Discord = require('discord.js');

const GithubApi = require('./src/github_api');
const MessageHandler = require('./src/message_handler');
const validate = require('./src/validate');

const {
  DISCORD_API_TOKEN: discordToken,
  GITHUB_API_TOKEN: githubToken,
  GITHUB_ORG_NAME: githubOrgName,
  BOT_NAME: botName,
} = process.env;

validate.token(githubToken, discordToken);
validate.bot(githubOrgName, botName);

const github = new GithubApi(githubToken, githubOrgName);
const messageHandler = new MessageHandler(github, botName);

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log("I'm up!");
});

client.on('message', messageHandler.handleMessage);

client.on('error', err => {
  console.log(err);
});

client.login(discordToken);

// For setting up uptime robot / monitoring
const monitoringServer = Http.createServer((request, response) => {
  const statuses = {
    0: 'Ready',
    1: 'Connecting',
    2: 'Reconnecting',
    3: 'Idle',
    4: 'Nearly',
    5: 'Disconnected'
  };

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(statuses[client.status]);
  response.end();
});

monitoringServer.listen(httpPort, err => {
  if (err) {
    return console.log('monitoring crashed', err);
  }
  console.log(`monitoring server is listening on ${httpPort}`);
});
