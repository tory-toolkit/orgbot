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

});
