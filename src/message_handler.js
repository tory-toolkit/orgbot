const DefaultErrorMessage = 'Unknown error. Try again later, or contact @daveio if the issue persists.';

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

    this.github.inviteMember(user, responseHandler, err => {
      errorHandler(() => {
        switch (err) {
          case 'rate-limited':
            return 'GitHub rate-limits organisation invitations particularly aggressively. Unfortunately, we have reached the limit for this period. Try again in 24 hours.';
          
            default:
              return DefaultErrorMessage;
        }
      })
    });
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

    this.github.checkMembership(user, responseHandler, err => {
      errorHandler(({botName}) => {
        switch (err) {
          case 'not-found':
            return `\`${user}\` is not a member of the \`${this.github.org_name}\` organisation. If you would like to invite them, say \`${botName} invite ${user}\`.`
          
          default:
            return DefaultErrorMessage;
        }
      })
    });
  }
}

/// The entry point for handling a new message.
class MessageHandler {
  constructor(github, botName) {
    this.commands = [
      new InviteUserCommand(github),
      new CheckUserCommand(github)
    ];
    this.botName = botName || 'orgbot';

    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(message) {
    if (message.author.bot) return;

    const invocation = this.extractInvocation(message.content);

    if (invocation.botName !== this.botName) return;

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
        botName: this.botName,
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
}

module.exports = MessageHandler;
