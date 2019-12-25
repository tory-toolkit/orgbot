const GITHUB_ORG_NAME = process.env.GITHUB_ORG_NAME;
const BOT_NAME = process.env.BOT_NAME;

/// The command executed on `<BOT_NAME> invite <user>`
class InviteUserCommand {
  constructor(github) {
    this.name = 'invite';
    this.github = github;
  }

  run([user], responseHandler, errorHandler) {
    if (!user) {
      errorHandler(({userInvocation}) => {
        return `Invalid use of \`${userInvocation}\`. Try \`${userInvocation} <YOUR_GITHUB_USERNAME>\` instead.`;
      })
      return;
    }

    this.github.inviteMember(GITHUB_ORG_NAME, user, responseHandler);
  }
}

/// The command executed on `<BOT_NAME> check <user>`
class CheckUserCommand {
  constructor(github) {
    this.name = 'check';
    this.github = github;
  }

  run([user], responseHandler, errorHandler) {
    if (!user) {
      errorHandler(({userInvocation}) => {
        return `Invalid use of \`${userInvocation}\`. Try \`${userInvocation} <YOUR_GITHUB_USERNAME>\` instead.`;
      })
      return;
    }

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
    this.makeResponseHandler = this.makeResponseHandler.bind(this);
    this.makeErrorHandler = this.makeErrorHandler.bind(this);
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

    command.run(
      invocation.params,
      this.makeResponseHandler(message),
      this.makeErrorHandler(message, invocation)
    );
  }

  makeResponseHandler(message) {
    return response => message.reply(response);
  }

  makeErrorHandler(message, invocation) {
    return errorMessageFactory => {
      const errorMessageParams = {
        userInvocation: `${invocation.botName} ${invocation.commandName}`,
      }
      const errorMessage = errorMessageFactory(errorMessageParams);

      message.reply(errorMessage);
    }
  }

  extractInvocation(messageContent) {
    const [botName, commandName, ...params] = messageContent.toLowerCase().split(/ +/);
    return {
      botName: botName,
      commandName: commandName,
      params: params,
    };
  }

  invalidUseError(invocation) {
    const userInvocation = `${invocation.botName} ${invocation.commandName}`;
    return `Invalid use of \`${userInvocation}\`. Try \`${userInvocation} <YOUR_GITHUB_USERNAME>\` instead.`;
  }
}

module.exports = github => new MessageHandler(github);
