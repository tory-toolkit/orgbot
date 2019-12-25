const GITHUB_ORG_NAME = process.env.GITHUB_ORG_NAME;
const BOT_NAME = process.env.BOT_NAME;

/// The command executed on `orgbot invite <user>`
class InviteUserCommand {
  constructor(github) {
    this.name = 'invite';
    this.github = github;
  }

  run(user, responseHandler) {
    this.github.inviteMember(GITHUB_ORG_NAME, user, responseHandler);
  }
}

/// The command executed on `orgbot check <user>`
class CheckUserCommand {
  constructor(github) {
    this.name = 'check';
    this.github = github;
  }

  run(user, responseHandler) {
    this.github.checkMembership(GITHUB_ORG_NAME, user, responseHandler);
  }
}

/// The entry point for handling a new message.
class MessageHandler {
  constructor(github) {
    this.commands = [
      new InviteUserCommand(github),
      new CheckUserCommand(github)
    ];

    this.handleMessage = this.handleMessage.bind(this);
    this.extractInvocation = this.extractInvocation.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(message) {
    if (message.author.bot) return;

    const invocation = this.extractInvocation(message.content);

    if (invocation.botName !== BOT_NAME) return;

    const command = this.commands.find(
      command => command.name === invocation.commandName
    );
    if (!command) {
      message.reply(
        `I don't understand the command \`${invocation.commandName}\`.`
      );
      return;
    }

    if (!invocation.user) {
      message.reply(this.invalidUseError(invocation));
      return;
    }

    command.run(invocation.user, response => {
      message.reply(response);
    });
  }

  extractInvocation(messageContent) {
    const messageTokens = messageContent.toLowerCase().split(/ +/);
    return {
      botName: messageTokens[0],
      commandName: messageTokens[1],
      user: messageTokens[2]
    };
  }

  invalidUseError(invocation) {
    const userInvocation = `${invocation.botName} ${invocation.commandName}`;
    return `Invalid use of \`${userInvocation}\`. Try \`${userInvocation} <YOUR_GITHUB_USERNAME>\` instead.`;
  }
}

module.exports = github => new MessageHandler(github);
