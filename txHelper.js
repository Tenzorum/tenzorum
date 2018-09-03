var utils = require('web3-utils');
var ethUtils = require('ethereumjs-util');
var Web3 = require('web3');

//ropsten
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/vCE9q890Is08T4xq5qKm'));

let personalWalletAddress = "0xd1c3d54255536cd50c88baed4972a127acc942a1";
let privateKey = Buffer.from('2e5a537948b5d4dd63f690f5a82f8591cb5c41a562c9cce850adfb29a99a8cc5', 'hex');
let publicAddress = "0x9E48c4A74D618a567CD657579B728774f35B82C5";

let rewardTypeEther = "0x0000000000000000000000000000000000000000";
let noReward = 0;

var preparePayload = async function(targetWallet, from, to, value, data, rewardType, rewardAmount) {
    let personalWalletABI = [{"constant":false,"inputs":[{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"},{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_rewardType","type":"address"},{"name":"_rewardAmount","type":"uint256"}],"name":"execute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isActionAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMasterAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"roles","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"masterAccount","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];

    let walletInstance = new web3.eth.Contract(personalWalletABI, targetWallet);
    let nonce = await walletInstance.methods.nonces(from).call();

    console.log("nonce", nonce);
    let hash = ethUtils.toBuffer(utils.soliditySha3(targetWallet, from, to, value, data,
        rewardType, rewardAmount, nonce));

    let signedHash = ethUtils.ecsign(ethUtils.hashPersonalMessage(hash), privateKey);

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

var prepareTokenTransferData = async function(amount, to) {
    let encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'transfer',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'to'
        }, {
            type: 'uint256',
            name: 'amount'
        }]
    }, [amount, to]);
    return encoded;
}

var prepareAddMasterData = async function(account) {
    let encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addMasterAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
}

var prepareAddActionData = async function(account) {
    let encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addActionAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
}

var transferEtherNoReward = async function(ethAmountInWei, toAddress){
    let data = "0x00"; //this will be different for token transfer or any other contract function call
    let payload = await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

var transferTokensNoReward = async function(tokenAddress, amount, toAddress){
    let ethAmountInWei = 0;
    let data = await prepareTokenTransferData(amount, toAddress);
    console.log("data2", data);
    let payload = await preparePayload(personalWalletAddress, publicAddress, tokenAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

var addMasterNoReward = async function(account) {
    let ethAmountInWei = 0;
    let data = await prepareAddMasterData(account);
    let payload = await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, ethAmountInWei, data, rewardTypeEther, noReward);
    console.log(payload);
}

//Transfer ether payload:
let toAddress = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
let ethAmountInWei = 1;
transferEtherNoReward(ethAmountInWei, toAddress);

//Transfer tokens payload:
let tokenAddress = "0xa8DD19d74c12083F4d3cF8B323bC3c8a9F16c605";
let tenThousandTokens = web3.utils.toWei("10000", 'ether');
transferTokensNoReward(tokenAddress, tenThousandTokens, toAddress);

let newMasterAccount = "0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844";
addMasterNoReward(newMasterAccount);
