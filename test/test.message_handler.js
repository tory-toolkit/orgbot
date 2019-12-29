const mocha = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');

const validate = require('../src/validate');
const MessageHandler = require('../src/message_handler');

const it = mocha.it;
const describe = mocha.describe;
const afterEach = mocha.afterEach;

describe('MessageHandler', () => {
  const fakeGithub = {
    checkMembership: sinon.fake(),
    inviteMember: sinon.fake(),
    reset: function() {
      this.checkMembership = sinon.fake();
      this.inviteMember = sinon.fake();
    }
  };
  const messageHandler = new MessageHandler(fakeGithub);

  const makeMessage = function(partialMessage) {
    return { content: '', author: {}, reply: sinon.fake(), ...partialMessage };
  };

  afterEach(() => {
    fakeGithub.reset();
  });

  describe('handleMessage', () => {
    describe('when the message was sent by a bot', () => {
      const botMessage = makeMessage({ author: { bot: {} } });

      it('does not reply to the message', () => {
        messageHandler.handleMessage(botMessage);
        expect(botMessage.reply.called).to.equal(false);
      });
    });

    describe('when the message is not for orgbot', () => {
      const nonOrgbotMessage = makeMessage({
        content: 'anotherbot check user'
      });

      it('does not reply to the message', () => {
        messageHandler.handleMessage(nonOrgbotMessage);
        expect(nonOrgbotMessage.reply.called).to.equal(false);
      });
    });

    describe('when the command is not recognised', () => {
      const badCommandMessage = makeMessage({
        content: 'orgbot thisisinvalid'
      });
      const anotherBadCommandMessage = makeMessage({
        content: 'orgbot yuuuup'
      });

      it('replies with an appropriate error message', function() {
        messageHandler.handleMessage(badCommandMessage);
        const expectedError = "I don't understand the command `thisisinvalid`.";
        const args = badCommandMessage.reply.getCall(0).args;
        expect(args[0]).to.equal(expectedError);
      });

      it('does not use a hardcoded command name in the message', () => {
        messageHandler.handleMessage(anotherBadCommandMessage);
        const expectedError = "I don't understand the command `yuuuup`.";
        const args = anotherBadCommandMessage.reply.getCall(0).args;
        expect(args[0]).to.equal(expectedError);
      });
    });

    describe('orgbot check', () => {
      describe('when no user is passed in', () => {
        const checkNoUserMessage = makeMessage({ content: 'orgbot check' });

        it('replies with an error message', () => {
          messageHandler.handleMessage(checkNoUserMessage);
          const expectedError = 'Invalid use of `orgbot check`. Try `orgbot check <YOUR_GITHUB_USERNAME>` instead.'
          const args = checkNoUserMessage.reply.getCall(0).args;
          expect(args[0]).to.equal(expectedError);
        });
      });

      describe('when user tories_out is passed in', () => {
        const validMessage = makeMessage({
          content: 'orgbot check tories_out'
        });

        it('checks with github whether the user is part of the org', () => {
          messageHandler.handleMessage(validMessage);
          const args = fakeGithub.checkMembership.getCall(0).args;
          expect(args.slice(0, 2)).to.be.deep.equal([
            'tory-toolkit',
            'tories_out'
          ]);
        });

        describe('and the github check completes', () => {
          it('replies with the response from github', () => {
            messageHandler.handleMessage(validMessage);
            fakeGithub.checkMembership.getCall(0).args[2]('All done');
            const message = validMessage.reply.getCall(0).args[0];
            expect(message).to.equal('All done');
          });
        });
      });
    });

    describe('orgbot invite', () => {
      describe('when no user is passed in', () => {
        const inviteNoUserMessage = makeMessage({
          content: 'orgbot invite'
        });

        it('replies with an error message', () => {
          messageHandler.handleMessage(inviteNoUserMessage);
          const expectedError = 'Invalid use of `orgbot invite`. Try `orgbot invite <YOUR_GITHUB_USERNAME>` instead.'
          const args = inviteNoUserMessage.reply.getCall(0).args;
          expect(args[0]).to.equal(expectedError);
        });
      });

      describe('when user no-ethical-consumption is passed in', () => {
        const validMessage = makeMessage({
          content: 'orgbot invite no-ethical-consumption'
        });

        it('tells github to invite them to the org', () => {
          messageHandler.handleMessage(validMessage);
          const args = fakeGithub.inviteMember.getCall(0).args;
          expect(args.slice(0, 2)).to.be.deep.equal([
            'tory-toolkit',
            'no-ethical-consumption'
          ]);
        });

        describe('and github completes', () => {
          it('replies with the response from github', () => {
            messageHandler.handleMessage(validMessage);
            fakeGithub.inviteMember.getCall(0).args[2]('Looks good');
            const message = validMessage.reply.getCall(0).args[0];
            expect(message).to.equal('Looks good');
          });
        });
      });
    });
  });
});
