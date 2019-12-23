class MessageHandler {
  constructor(github) {
    this.github = github;
  }

  handleMessage(message) {
    if (message.author.bot) return;

    const messageTokens = message.content.toLowerCase().split(/ +/);
    const orgName = 'tory-toolkit';

    if (!messageTokens[0] === 'orgbot') return;

    const command = messageTokens[1];
    const user = messageTokens[2];

    if (command === 'check') {
      if (messageTokens.length === 3) {
        this.github.checkMembership(orgName, user, resp => {
          message.reply(resp);
        });
      } else {
        message.reply(`Invalid command. Try
        \`orgbot check USERNAME \` -- check if GitHub user USERNAME is a member of the organisation`);
      }
    }

    if (command === 'invite') {
      if (messageTokens.length === 3) {
        this.github.inviteMember(orgName, user, resp => {
          message.reply(resp);
        });
      } else {
        message.reply(`Invalid command. Try
        \`orgbot invite USERNAME\` -- invite GitHub user USERNAME to the organisation`);
      }
    }
  }

}

module.exports = MessageHandler;
