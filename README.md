# Nebtest

NebTest will let you to test your nebulas smart contracts just like you write unit test for any javascript applications.

# Features

* You can configure for testing in your testnet / mainnet.
* Run test case with multiple test data at a time using json. 
* Will deploy a smart contract before each test case to run your test case in clean state.

# Pre-requisites

* node >= 8.10.3

# Methods

|   Name	|   Parameters	|  Return 	|  Description 	|
|---	|:----:|:----:|---	|
|   createNewAccount	|  - 	|  Account 	|   Creates a new account from wallet	|
|  transferToken 	|  to, token  |  -	|   Send token to the given address from wallet	|
|  deployContract 	|  fileName	|  - 	|  Deploy the contract file |
|  callContract 	|   value, call	|  transaction 	|  Call the specified methods with arguments 	|
|  transact 	|   value, call	|  receipt 	|  Returns the transaction receipt 	|

# Getting Started

1. **Install**  
  npm install --save nebtest  
  npm install --save mocha chai

2. **Include nebtest to your test case**  
  const Nebtest = require('nebtest');

3. **Export variables**  
    export ENVIRONMENT='testnet'  
    export SOURCEACCOUNT='wallet private key'  
    export COINBASE='wallet address'

4. **Mock Contract**  
    Place your contract files in test directory
    ```
        test/contracts/contractFile.js
    ```

5. **Test data**  
    Place your test data in test directory
    ```
        test/testCases.json
    ```

6. **Test data - sample format**
    ```
    const testData = [
      {
        name: 'Test Case Description',
        data: [
          {
            name: 'Test data name',
            testInput: {
              ...test inputs
            },
            testExpect: {
              ...test result expect
            }
          }
        ]
      }
    ```
7. **Run test**

    Add following command to scripts
    ```
    "scripts": {
      ...
      "test": "mocha --timeout 600000"
    }
    ```
    Run the test as,

    ```
      npm run test
    ```

# Example

  Check here for a complete [example](https://github.com/sivai2i/nebtest/tree/master/example)

# Resources

  [Steps for creating nebulas web wallet](https://medium.com/nebulasio/creating-a-nas-wallet-9d01b5fa2df6)

  [To claim free nebulas tokens](https://testnet.nebulas.io/claim/https://testnet.nebulas.io/claim/)
