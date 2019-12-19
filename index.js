const Http = require('http');

const Discord = require('discord.js');

const pronounify = require('./src/pronouns');
const validate = require('./src/validate');

const token = process.env.DISCORD_API_TOKEN;

validate.token(token);

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I\'m up!');
});

client.on('message', message => {
  const pronouns = pronounify.extractPronouns(message.content)

  if (pronouns) {
    const guildRoles = message.guild.roles;
    const member = message.member;
    const returnMessage = pronounify.setPronouns(roleName, guildRoles, member);
    if (returnMessage) {
      message.channel.send(returnMessage);
    } else {
      console.log('there was a problem setting roles, missing role?');
    }
  }

});

client.on('error', (err) => {
  console.log(err);
});

client.login(token);

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

monitoringServer.listen(3838, (err) => {
  if (err) {
    return console.log('monitoring crashed', err);
  }
  console.log(`monitoring server is listening on ${3838}`);
});