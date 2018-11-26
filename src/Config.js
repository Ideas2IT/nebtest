class Config {
  constructor() {
    this.chainId = 1001;
    this.sourceAccount = process.env.SOURCEACCOUNT;
    this.coinbase = process.env.COINBASE;
    this.apiEndPoint = 'https://testnet.nebulas.io';
    this.gasPrice = 1000000;
    this.gasLimit = 200000;
    this.keyStore = '{"version":4,"id":"64b19f5b-d7e9-4d1b-b501-7f9db29a87f9","address":"n1PZK5ttjwQGVMc5xwSSnnz6gWkP6dXhE8V","crypto":{"ciphertext":"35ab633ec08aadaddd1ab7efc0e8d6633ea1e6cb8d4fbe4371cab92353da7cf1","cipherparams":{"iv":"ac09bdfeffe731cf35018368d47bdd61"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"6ab533178ee5d0e77aa575f7ed7881aa822cdf3bac4bc2ab4c336b411951f448","n":4096,"r":8,"p":1},"mac":"8dc82d6100bbb1a6c4d6cfa1790e342e36d9f95a202ada089f7c35528c00d0ff","machash":"sha3256"}}';
    this.passphrase = process.env.PASSPHRASE;

    if (process.env.ENVIRONMENT === 'testnet') {
      this.chainId = 1001;
      this.apiEndPoint = 'https://testnet.nebulas.io';
    }
  }
}

module.exports = Config;
