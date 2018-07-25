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
  const Nebtest = require('Nebtest');

3. **Export variables**  
    export ENVIRONMENT='testnet'  
    export SOURCEACCOUNT='wallet private key'  
    export COINBASE='wallet address'

4. **Mock Contract**  
    Place your contract files in test directory
    ```
        test/contracts/contractFile.js
    ```

5. **Test data - sample format**
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

# Example

  Check here for a complete [example](https://github.com/sivai2i/nebtest/tree/master/example)

**Test Result**  
  <img src="https://github.com/Ideas2IT/nebtest/blob/master/screenshot/example.png" />