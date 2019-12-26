const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

const validate = require('../src/validate');

const it = mocha.it;
const expect = chai.expect;
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;
const afterEach = mocha.afterEach;

describe('validate', () => {

  describe('token', () => {
    let exitStub;
    let logStub;

    before(() => {
      exitStub = sinon.stub(process, 'exit');
      // to supress error messages to logs
      logStub = sinon.stub(console, 'log');
    });

    after(() => {
      process.exit.restore();
      console.log.restore();
    });

    afterEach(() => {
      exitStub.reset();
      logStub.reset();
    });

    it('Should exit when GITHUB_API_TOKEN is not set', () => {
      const error = 'GITHUB_API_TOKEN environment variable is required for this bot to successfully start';

      validate.token(null, null);

      sinon.assert.called(process.exit);
      sinon.assert.calledWith(process.exit, 1);
      sinon.assert.called(console.log);
      expect(logStub.calledWith(error)).to.equal(true);
    });

    it('Should exit when DISCORD_API_TOKEN is not set', () => {
      const error = 'DISCORD_API_TOKEN environment variable is required for this bot to successfully start';

      validate.token('sommet', null);

      sinon.assert.called(process.exit);
      sinon.assert.calledWith(process.exit, 1);
      sinon.assert.called(console.log);
      expect(logStub.calledWith(error)).to.equal(true);
    });

    it('Should not exit when env vars are set', () => {
      validate.token('sommet', 'sommettelse');

      sinon.assert.notCalled(process.exit);
      sinon.assert.notCalled(process.exit);
      sinon.assert.notCalled(console.log);
    });

  });

  describe('bot', () => {
    let logStub;

    before(() => {
      logStub = sinon.stub(console, 'log');
    });

    after(() => {
      console.log.restore();
    });

    afterEach(() => {
      logStub.reset();
    });

    it('Should log a warning message when GITHUB_ORG_NAME is not set', () => {
      const warning = 'GITHUB_ORG_NAME environment variable not supplied, defaulting to "tory-toolkit"';
      validate.bot(null, 'bot-name');

      sinon.assert.called(console.log);
      expect(logStub.calledWith(warning)).to.equal(true);
    })

    it('Should log a warning message when BOT_NAME is not set', () => {
      const warning = 'BOT_NAME environment variable not supplied, defaulting to "orgbot"';
      validate.bot('org-name', null);

      sinon.assert.called(console.log);
      expect(logStub.calledWith(warning)).to.equal(true);
    })

    it('Should not log any messages when GITHUB_ORG_NAME and BOT_NAME are set', () => {
      validate.bot('org-name', 'bot-name');

      sinon.assert.notCalled(console.log);
    })

  });

});
