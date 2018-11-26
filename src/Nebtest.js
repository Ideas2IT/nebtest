const Wallet = require('nebulas');
const FS = require('fs');
const logger = require('winston');
const path = require('path');
const Config = require('./Config');

const testConfig = new Config();
const request = new Wallet.HttpRequest(testConfig.apiEndPoint);

class Nebtest {
  constructor() {
    this.account = Wallet.Account;
    this.Transaction = Wallet.Transaction;
    this.unit = Wallet.Unit;
    this.neb = new Wallet.Neb();
    this.neb.setRequest(request);
    this.chainId = testConfig.chainId;
    this.sourceAccount = new Wallet.Account(testConfig.sourceAccount);
    this.coinBase = testConfig.coinbase;
    this.contractAddr = '';
    this.delayTime = 5000;
    const account = this.account.NewAccount();
    this.from = account.fromKey(testConfig.keyStore, testConfig.passphrase, true);
  }

  /**
   * Create a new account
   */
  createNewAccount() {
    const account = this.account.NewAccount();
    account.fromKey(testConfig.keyStore, testConfig.passphrase, true);
    this.from = account;
    return this.from;
  }

  /**
   * Get details of the given account
   * @param {string} account
   */
  getAccountState(account) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = this.neb.api.getAccountState(account);
        resolve(res);
      } catch (e) {
        logger.error('Error while getting account state...', e);
        reject(e);
      }
    });
  }

  /**
   * Send transaction
   * @param {string} tx
   */
  sendRawTransaction(tx) {
    return new Promise(async (resolve, reject) => {
      try {
        const txHash = await this.neb.api.sendRawTransaction(tx.toProtoString());
        resolve(txHash);
      } catch (e) {
        logger.error('Error while sending raw transaction...', e);
        reject(e);
      }
    });
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, this.delayTime));
  }

  getTransactionResult(hash) {
    return new Promise(async (resolve, reject) => {
      try {
        const receipt = await this.neb.api.getTransactionReceipt(hash);
        resolve(receipt);
      } catch (e) {
        logger.error('Error while checking transaction status...', e);
        reject(e);
      }
    });
  }

  async checkTransactionStatus(hash) {
    const receipt = await this.getTransactionResult(hash);
    if (receipt.status === 2) {
      await this.delay();
      return this.checkTransactionStatus(hash);
    }
    return receipt;
  }

  /**
   * Deploy smart contract file
   * @param {string} fileName
   */
  async deployContract(fileName, args) {
    const accountRes = await this.getAccountState(this.from.getAddressString());
    const fullPath = path.join(process.env.PWD, '/test/contracts/', fileName);
    const contractFile = FS.readFileSync(fullPath, 'utf-8');
    const contract = {
      source: contractFile,
      sourceType: 'js',
    };
    if (args && args instanceof Array && args.length > 0) {
      contract[args] = JSON.stringify(args);
    }
    const tx = new this.Transaction(this.chainId, this.from, this.from, 0,
      parseInt(accountRes.nonce, 10) + 1, testConfig.gasPrice, testConfig.gasLimit, contract);
    tx.signTransaction();
    try {
      const resp = await this.sendRawTransaction(tx);
      this.contractAddr = resp.contract_address;
      await this.checkTransactionStatus(resp.txhash);
      return Promise.resolve(resp.contract_address);
    } catch (e) {
      logger.error('Error while deploying contract...', e);
      return Promise.reject(e);
    }
  }

  /**
   * Transfer amount to another account
   * @param {string} to
   * @param {number} amount
   */
  async transferToken(to, amount) {
    const account = await this.getAccountState(this.sourceAccount.getAddressString());
    const tx = new this.Transaction(this.chainId, this.sourceAccount, to,
      this.unit.nasToBasic(amount), parseInt(account.nonce, 10) + 1, 0, 2000000);
    tx.signTransaction();
    const txHash = await this.sendRawTransaction(tx);
    const result = await this.checkTransactionStatus(txHash.txhash);
    if (result.status === 0) {
      throw new Error(result.execute_error);
    }
  }

  /**
   * Write to smart contract
   * @param {number} value
   * @param {object} call
   */
  async transact(value = 0, call) {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await this.getAccountState(this.from.getAddressString());
        const tx = new this.Transaction(this.chainId, this.from, this.contractAddr,
          value, parseInt(account.nonce, 10) + 1, testConfig.gasPrice, testConfig.gasLimit, call);
        tx.signTransaction();
        const txHash = await this.sendRawTransaction(tx);
        const receipt = await this.checkTransactionStatus(txHash.txhash);
        resolve(receipt);
      } catch (e) {
        logger.error('Error while estimating gas...', e);
        reject(e);
      }
    });
  }

  /**
   * To read the smart contract
   * @param {number} value
   * @param {object} call
   */
  async callContract(value = 0, call) {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await this.getAccountState(this.from.getAddressString());
        const res = await this.neb.api.call(this.from.getAddressString(), this.contractAddr, value,
          account.nonce, testConfig.gasPrice, testConfig.gasLimit, call);
        resolve(res);
      } catch (e) {
        logger.error('Error while calling callcontract...', e);
        reject(e);
      }
    });
  }
}

module.exports = Nebtest;
