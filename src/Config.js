class Config {
  constructor() {
    this.chainId = 1001;
    this.sourceAccount = process.env.SOURCEACCOUNT;
    this.coinbase = process.env.COINBASE;
    this.apiEndPoint = 'https://testnet.nebulas.io';
    this.gasPrice = 1000000;
    this.gasLimit = 200000;

    if (process.env.ENVIRONMENT === 'testnet') {
      this.chainId = 1001;
      this.apiEndPoint = 'https://testnet.nebulas.io';
    }
  }
}

module.exports = Config;
