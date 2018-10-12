<p align="center">
  <a href="https://tenzorum.org/">
    <img alt="tenzorum" src="https://tenzorum.org/wp-content/uploads/2018/09/logo_tenz-e1537146360637.png" width="144">
  </a>
</p>

<h3 align="center">
  Tenzorum
</h3>

<p align="center">
  Easy to use SDK for implementing gasless transactions
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tenzorum"><img src="https://img.shields.io/npm/v/tenzorum.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/tenzorum"><img src="https://img.shields.io/npm/dm/tenzorum.svg?style=flat-square"></a>
</p>

[![npm Version](https://img.shields.io/npm/v/tenzorum.svg)](https://www.npmjs.com/package/tenzorum)
[![License](https://img.shields.io/npm/l/tenzorum.svg)](https://www.npmjs.com/package/tenzorum)
[![Build Status](https://travis-ci.org/airbnb/enzyme.svg)](https://travis-ci.org/airbnb/enzyme)


## Dependencies

Users must have an environment capable of running web3@1.0.0

| Package                                                | Version                                                                                                                             | Docs                                                                                                                                                                                                                                                                          | Description                                                                        |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`web3`](/packages/web3)               | [![npm](https://img.shields.io/npm/v/web3.svg?style=flat-square)](https://www.npmjs.com/package/web3)               | [![](https://img.shields.io/badge/API%20Docs-site-green.svg?style=flat-square)](https://web3js.readthedocs.io/en/1.0/getting-started.html) [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/web3/docs)          | The core of web3                                                          |


# Tenzorum TSNN SDK
## About

Utility for signing transactions and interaction with TSNN.

```bash
npm i tenzorum --save
```

```javascript
const tenzSdk = require('tenzorum');
tenzSdk.initSdk(web3, privateKey, personalWalletAddress);
const result = await tenzSdk.transferTokensWithTokenReward(tokenAddress, tenTokens, toAddress, oneToken);
console.log(result);
```
```ES6
ES6
import {initSdk, transferTokensWithTokenReward} from 'tenzorum';
const result = await transferTokensWithTokenReward(tokenAddress, tenTokens, toAddress, oneToken);
console.log(result);


```

This will print out a message in the following format as expected in the body of POST 
request by TSNN:

```js
{
  "v":"0x1b",
  "r":"0x2a061c04485a307802d76f3e4c7fda40ec4d3390df3c6df28fd6c3165ca1fb59",
  "s":"0x5dd8b1d92512baa9ce7e49cad004a45c4bdabf8b852c99f522740f62b955a6c6",
  "from":"0x9E48c4A74D618a567CD657579B728774f35B82C5",
  "to":"0xf74694642a81a226771981cd38df9105a133c111",
  "value":"0",
  "data":"0x947aca55000000000000000000000000f938bfdc53f72cb7a4b1946969ba0cce05c902c6",
  "rewardType":"0x0000000000000000000000000000000000000000",
  "rewardAmount":"0"
}
```

where:

* v, r, s - components of the signature of the message
* from - source address that signed the message
* to - target address if sending ether, or token contract address for token transfer
* value - amount of ether to send
* data - function payload like token transfer data or any other function call
* rewardType - address(0) for ether, and token contract address for tokens payable as fee
* rewardAmount - how much of ether/token should be paid as the fee


For full working example check [example.js](https://github.com/Tenzorum/tenzorum-pkg/blob/master/example.js).
