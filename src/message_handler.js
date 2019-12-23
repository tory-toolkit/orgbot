class MessageHandler {
  constructor(github) {
    this.github = github;
  }

  handleMessage(message) {
    if (message.author.bot) return;

    const messageTokens = message.content.toLowerCase().split(/ +/);
    const orgName = 'tory-toolkit';

    if (messageTokens[0] !== 'orgbot') return;

    const command = messageTokens[1];
    const user = messageTokens[2];

    const isRecognisedCommand = ['check', 'invite'].includes(command);
    if (isRecognisedCommand) {
      if (command === 'check') {
        if (messageTokens.length === 3) {
          this.github.checkMembership(orgName, user, resp => {
            message.reply(resp);
          });
        } else {
          message.reply('Invalid use of `orgbot check`. Try `orgbot check <YOUR_GITHUB_USERNAME>` instead.');
        }
      }

      if (command === 'invite') {
        if (messageTokens.length === 3) {
          this.github.inviteMember(orgName, user, resp => {
            message.reply(resp);
          });
        } else {
          message.reply('Invalid use of `orgbot invite`. Try `orgbot invite <YOUR_GITHUB_USERNAME>` instead.');
        }
      }
    } else {
      message.reply(`I don't understand the command \`${command}\`.`)
    }
  }
}

module.exports = MessageHandler;
