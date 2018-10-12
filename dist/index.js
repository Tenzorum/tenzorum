'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* Tenzorum TSNN Client SDK - https://tenzorum.org
 *
 * @author  Radek Ostrowski & Mark Pereira
 */

var utils = require('web3-utils');
var ethUtils = require('ethereumjs-util');
var fetch = require('node-fetch');

var isInitialised = false;

var zeroWei = 0;
var noData = exports.noData = "0x00";
var rewardTypeEther = exports.rewardTypeEther = "0x0000000000000000000000000000000000000000";
var tsnUri = exports.tsnUri = "http://tsnn.tenzorum.xyz:1888/tsnn";
var personalWalletABI = exports.personalWalletABI = [{ "constant": false, "inputs": [{ "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_data", "type": "bytes" }, { "name": "_rewardType", "type": "address" }, { "name": "_rewardAmount", "type": "uint256" }], "name": "execute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isActionAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "canLogIn", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMasterAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMasterAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "roles", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "removeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addActionAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "masterAccount", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }];

//mainnet
//export const loveTokenAddress = "0x00";
//ropsten
var loveTokenAddress = exports.loveTokenAddress = "0x2134833ace155a1d54160fbe7d4651c4c67dc7f2";

var web3 = void 0;
var privateKey = void 0;
var publicAddress = void 0;
var personalWalletAddress = void 0;

var initSdk = exports.initSdk = function initSdk(_web3, _privateKey, _personalWalletAddress) {
    web3 = _web3;
    personalWalletAddress = _personalWalletAddress;
    privateKey = Buffer.from(_privateKey, 'hex');
    publicAddress = ethUtils.bufferToHex(ethUtils.privateToAddress(privateKey));
    isInitialised = true;
};

var getTsn = exports.getTsn = async function getTsn() {
    var response = await fetch(tsnUri);
    var json = await response.json();
    return json.tsn;
};

var relayTx = async function relayTx(payload) {
    var res = await fetch('https://tenz-tsn-js-azxbvdmtys.now.sh/execute/' + personalWalletAddress, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: payload
    });

    return JSON.parse((await res.text()));
};

var checkAccess = exports.checkAccess = exports.checkAccess = async function checkAccess(address) {
    var personalWallet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : personalWalletAddress;

    var walletInstance = new web3.eth.Contract(personalWalletABI, personalWallet);
    return await walletInstance.methods.canLogIn(address).call().catch(function (e) {
        return false;
    });
};

var preparePayload = exports.preparePayload = async function preparePayload(targetWallet, from, to, value, data, rewardType, rewardAmount) {
    if (!isInitialised) console.log("ERROR: SDK not initialized");

    var walletInstance = new web3.eth.Contract(personalWalletABI, targetWallet);
    var nonce = await walletInstance.methods.nonces(from).call();
    var hash = ethUtils.toBuffer(utils.soliditySha3(targetWallet, from, to, value, data, rewardType, rewardAmount, nonce));

    var signedHash = ethUtils.ecsign(ethUtils.hashPersonalMessage(hash), privateKey);

    var payload = {};
    payload.v = ethUtils.bufferToHex(signedHash.v);
    payload.r = ethUtils.bufferToHex(signedHash.r);
    payload.s = ethUtils.bufferToHex(signedHash.s);
    payload.from = from;
    payload.to = to;
    payload.value = value.toString();
    payload.data = data;
    payload.rewardType = rewardType;
    payload.rewardAmount = rewardAmount.toString();

    // console.log('"'+payload.v+'","'+payload.r+'","'+payload.s+'","'+payload.from+'","'+payload.to+'","'+
    //     payload.value+'","'+payload.data+'","'+payload.rewardType+'","'+payload.rewardAmount+'"');

    return JSON.stringify(payload);
};

var prepareTokenTransferData = exports.prepareTokenTransferData = async function prepareTokenTransferData(amount, to) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
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
};

var prepareAddMasterData = exports.prepareAddMasterData = async function prepareAddMasterData(account) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addMasterAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
};

var prepareAddActionData = exports.prepareAddActionData = async function prepareAddActionData(account) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'addActionAccount',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, [account]);
    return encoded;
};

var prepareShareLoveData = exports.prepareShareLoveData = async function prepareShareLoveData(account) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'shareLove',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'to'
        }, {
            type: 'uint256',
            name: 'amount'
        }]
    }, [account]);
    return encoded;
};

var prepareCreateSubdomainData = exports.prepareCreateSubdomainData = async function prepareCreateSubdomainData(subdomain, domain, topdomain, owner, target) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'newSubdomain',
        type: 'function',
        inputs: [{
            type: 'string',
            name: '_subdomain'
        }, {
            type: 'string',
            name: '_domain'
        }, {
            type: 'string',
            name: '_topdomain'
        }, {
            type: 'address',
            name: '_owner'
        }, {
            type: 'address',
            name: '_target'
        }]
    }, [subdomain, domain, topdomain, owner, target]);
    return encoded;
};

var transferEtherNoReward = exports.transferEtherNoReward = async function transferEtherNoReward(ethAmountInWei, toAddress) {
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, noData, rewardTypeEther, zeroWei)));
};

var transferEtherWithEtherReward = exports.transferEtherWithEtherReward = async function transferEtherWithEtherReward(ethAmountInWei, toAddress, rewardAmount) {
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, noData, rewardTypeEther, rewardAmount)));
};

var transferTokensNoReward = exports.transferTokensNoReward = async function transferTokensNoReward(tokenAddress, amount, toAddress) {
    var data = await prepareTokenTransferData(amount, toAddress);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, tokenAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

var transferTokensWithTokenReward = exports.transferTokensWithTokenReward = async function transferTokensWithTokenReward(tokenAddress, amount, toAddress, rewardAmount) {
    var data = await prepareTokenTransferData(amount, toAddress);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, tokenAddress, zeroWei, data, tokenAddress, rewardAmount)));
};

var addMasterNoReward = exports.addMasterNoReward = async function addMasterNoReward(account) {
    var data = await prepareAddMasterData(account);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

var addActionNoReward = exports.addActionNoReward = async function addActionNoReward(account) {
    var data = await prepareAddActionData(account);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

//For Love Token Only: https://github.com/Tenzorum/love-token
var shareLove = exports.shareLove = async function shareLove(toAddress, amount) {
    var data = await prepareShareLoveData(toAddress, amount);
    return relayTx((await preparePayload(loveTokenAddress, publicAddress, loveTokenAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

//Using Love Token contract to create tenz-id as a meta-tx
var createTenzId = exports.createTenzId = async function createTenzId(subdomain, owner, target) {
    var data = await prepareCreateSubdomainData(subdomain, "tenz-id", "xyz", owner, target);
    return relayTx((await preparePayload(loveTokenAddress, publicAddress, loveTokenAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

module.exports = {
    initSdk: initSdk,
    getTsn: getTsn,
    checkAccess: checkAccess,
    transferEtherNoReward: transferEtherNoReward,
    transferEtherWithEtherReward: transferEtherWithEtherReward,
    transferTokensNoReward: transferTokensNoReward,
    transferTokensWithTokenReward: transferTokensWithTokenReward,
    addMasterNoReward: addMasterNoReward,
    addActionNoReward: addActionNoReward,
    shareLove: shareLove,
    createTenzId: createTenzId
};