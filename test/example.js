const tenzSdk = require('../dist/index.js');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/vCE9q890Is08T4xq5qKm'));

const personalWalletAddress = "0xf74694642a81a226771981cd38df9105a133c111";
const privateKey = "2e5a537948b5d4dd63f690f5a82f8591cb5c41a562c9cce850adfb29a99a8cc5";

(async () => {
    //first init the SDK with your web3 instance, private key of the wallet to use and the personal wallet address
    tenzSdk.initSdk(web3, privateKey, personalWalletAddress);

    console.log("Transfer ether no fee");
    const toAddress = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
    const ethAmountInWei = 10;
    let result = await tenzSdk.transferEtherNoReward(ethAmountInWei, toAddress);
    console.log(result);

    console.log("Transfer ether with ether fee");
    const ethRewardInWei = 1;
    result = await tenzSdk.transferEtherWithEtherReward(ethAmountInWei, toAddress, ethRewardInWei);
    console.log(result);

    console.log("Transfer tokens no fee");
    const tokenAddress = "0xa8DD19d74c12083F4d3cF8B323bC3c8a9F16c605";
    const tenTokens = web3.utils.toWei('10', 'ether');
    result = await tenzSdk.transferTokensNoReward(tokenAddress, tenTokens, toAddress);
    console.log(result);

    console.log("Transfer tokens with fee paid in tokens");
    const oneToken = web3.utils.toWei('1', 'ether');
    result = await tenzSdk.transferTokensWithTokenReward(tokenAddress, tenTokens, toAddress, oneToken);
    console.log(result);

    console.log("Add new master account no fee");
    const newMasterAccount = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
    result = await tenzSdk.addMasterNoReward(newMasterAccount);
    console.log(result);

    console.log("Add new action account no fee");
    const newActionAccount = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
    result = await tenzSdk.addActionNoReward(newActionAccount);
    console.log(result);
})()

