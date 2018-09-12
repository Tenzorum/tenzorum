const utils = require('web3-utils');
const ethUtils = require('ethereumjs-util');
const Web3 = require('web3');

//ropsten
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/vCE9q890Is08T4xq5qKm'));

const personalWalletAddress = "0xf74694642a81a226771981cd38df9105a133c111";
const privateKey = Buffer.from('2e5a537948b5d4dd63f690f5a82f8591cb5c41a562c9cce850adfb29a99a8cc5', 'hex');
const publicAddress = "0x9E48c4A74D618a567CD657579B728774f35B82C5";

const rewardTypeEther = "0x0000000000000000000000000000000000000000";
const noReward = 0;

export const preparePayload = async (targetWallet, from, to, value, data, rewardType, rewardAmount) => {
    const personalWalletABI = [{"constant":false,"inputs":[{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"},{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_rewardType","type":"address"},{"name":"_rewardAmount","type":"uint256"}],"name":"execute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isActionAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMasterAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"roles","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"masterAccount","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

    const walletInstance = new web3.eth.Contract(personalWalletABI, targetWallet);
    const nonce = await walletInstance.methods.nonces(from).call();

    console.log("nonce", nonce);
    const hash = ethUtils.toBuffer(utils.soliditySha3(targetWallet, from, to, value, data,
        rewardType, rewardAmount, nonce));

    const signedHash = ethUtils.ecsign(ethUtils.hashPersonalMessage(hash), privateKey);

    let payload = {};
    payload.v = ethUtils.bufferToHex(signedHash.v);
    payload.r = ethUtils.bufferToHex(signedHash.r);
    payload.s = ethUtils.bufferToHex(signedHash.s);
    payload.from = from;
    payload.to = to;
    payload.value = value;
    payload.data = data;
    payload.rewardType = rewardType;
    payload.rewardAmount = rewardAmount;

    // console.log('"'+payload.v+'","'+payload.r+'","'+payload.s+'","'+payload.from+'","'+payload.to+'","'+
    //     payload.value+'","'+payload.data+'","'+payload.rewardType+'","'+payload.rewardAmount+'"');

    console.log("Make a POST request to http://localhost:7777/execute/" + targetWallet);
    return JSON.stringify(payload);
}

export const prepareTokenTransferData = async (amount, to) => {
    const encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'transfer',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'to'
        }, {
            type: 'uint256',
            name: 'amount'
        }]
    }, [to, amount]);
    return encoded;
}

export const prepareAddMasterData = async (account) => {
    const encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addMasterAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
}

export const prepareAddActionData = async (account) => {
    const encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addActionAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
}

export const transferEtherNoReward = async (ethAmountInWei, toAddress) => {
    const data = "0x00"; //this will be different for token transfer or any other contract function call
    const payload = await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

export const transferEtherWithEtherReward = async (ethAmountInWei, toAddress, rewardAmount) => {
    const data = "0x00"; //this will be different for token transfer or any other contract function call
    const payload = await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, data, rewardTypeEther, rewardAmount);
    console.log(payload);
}

export const transferTokensNoReward = async (tokenAddress, amount, toAddress) => {
    const ethAmountInWei = 0;
    const data = await prepareTokenTransferData(amount, toAddress);
    console.log("data2", data);
    const payload = await preparePayload(personalWalletAddress, publicAddress, tokenAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

export const transferTokensWithTokenReward = async (tokenAddress, amount, toAddress, rewardAmount) => {
    const ethAmountInWei = 0;
    const data = await prepareTokenTransferData(amount, toAddress);
    console.log("data2", data);
    const payload = await preparePayload(personalWalletAddress, publicAddress, tokenAddress, ethAmountInWei, data, tokenAddress, rewardAmount);
    console.log(payload);
}

export const addMasterNoReward = async (account) => {
    const ethAmountInWei = 0;
    const data = await prepareAddMasterData(account);
    const payload = await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

//----------------Examples-------------------------//

// //Transfer ether payload:
// const toAddress = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
// const ethAmountInWei = 1;
// transferEtherNoReward(ethAmountInWei, toAddress);
//
// //Transfer tokens payload:
// const tokenAddress = "0xa8DD19d74c12083F4d3cF8B323bC3c8a9F16c605";
// const tenThousandTokens = web3.utils.toWei("10000", 'ether');
// transferTokensNoReward(tokenAddress, tenThousandTokens, toAddress);
//
// const newMasterAccount = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
// addMasterNoReward(newMasterAccount);
