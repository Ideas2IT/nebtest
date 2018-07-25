const { expect } = require('chai');
const testCases = require('./testCases'); // Import test case file
const Nebtest = require('../src/Nebtest');

// Pass contract file name to deploy
const filePath = 'BankVaultContract.js';
const nebtestBase = new Nebtest();

async function testContract(testInput, testExpect) {
  return new Promise(async (resolve, reject) => {
    try {
      const call = {
        function: testInput.func,
        args: testInput.args,
      };
      if (testInput.type === 'write') {
        const receipt = await nebtestBase.transact(testInput.value, call);
        expect(receipt).to.have.property('status').equal(1);
      } else {
        const transaction = await nebtestBase.callContract(testInput.value, call);
        if (testExpect.canCheck) {
          const txObj = JSON.parse(transaction.result);
          expect(testExpect.balance).to.eql(parseInt(txObj.balance, 10));
        }
      }
      resolve();
    } catch (e) {
      if (testExpect.hasError) {
        try {
          expect(e.toString()).to.have.string(testExpect.errorMsg);
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject(e);
      }
    }
  });
}

testCases.forEach((testCase) => {
  describe(testCase.name, () => {
    /**
     * Before runnig each test case deploy the smart contract,
     * create a new account and transfer amount to start
     * testing in a clean state
     */
    before(async () => {
      const newAccount = await nebtestBase.createNewAccount();
      await nebtestBase.transferToken(newAccount, 0.001);
      await nebtestBase.deployContract(filePath);
    });
    testCase.data.forEach((data) => {
      it(data.name, async () => {
        await testContract(data.testInput, data.testExpect);
      });
    });
  });
});
