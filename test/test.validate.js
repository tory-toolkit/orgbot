const mocha = require('mocha');
const sinon = require('sinon');

const validate = require('../src/validate');

const it = mocha.it;
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

    it('Should exit when environment variable is not set', () => {
      validate.token(null);

      sinon.assert.called(process.exit);
      sinon.assert.calledWith(process.exit, 1);
    });

    it('Should not exit when environment variable is set', () => {
      validate.token('something');

      sinon.assert.notCalled(process.exit);
    });
  
  });

});
