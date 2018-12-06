"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * @desc Tenzorum TSNN Client SDK - https://tenzorum.org
 * @authors:
 *  Radek Ostrowski
 *  Mark Pereira
 *
 * @var web3 - the web3@1.0.0 module you are using for your dapp
 * @var privateKey - the private key the user is using to access their personal wallet
 * @var publicAddress - the public address directly derived from the privateKey
 * @var personalWalletAddress - the address of your Tenzorum Personal Wallet Address
 * @var isInitialised - variable stating whether or not the SDK is initialised
 *
**/

var Web3 = require('web3');
var web3 = new Web3();

var tnsAbi = [{ "anonymous": false, "inputs": [], "name": "DomainTransfersLocked", "type": "event" }, { "constant": false, "inputs": [], "name": "lockDomainOwnershipTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }, { "name": "_owner", "type": "address" }, { "name": "_target", "type": "address" }], "name": "newSubdomain", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousRegistry", "type": "address" }, { "indexed": true, "name": "newRegistry", "type": "address" }], "name": "RegistryUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "creator", "type": "address" }, { "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "subdomain", "type": "string" }, { "indexed": false, "name": "domain", "type": "string" }, { "indexed": false, "name": "topdomain", "type": "string" }], "name": "SubdomainCreated", "type": "event" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferContractOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousResolver", "type": "address" }, { "indexed": true, "name": "newResolver", "type": "address" }], "name": "ResolverUpdated", "type": "event" }, { "constant": false, "inputs": [{ "name": "_node", "type": "bytes32" }, { "name": "_owner", "type": "address" }], "name": "transferDomainOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_registry", "type": "address" }], "name": "updateRegistry", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_resolver", "type": "address" }], "name": "updateResolver", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_registry", "type": "address" }, { "name": "_resolver", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [{ "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "domainOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "locked", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "registry", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "resolver", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "subdomainOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "subdomainTarget", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }];
var emptyAddress = '0x0000000000000000000000000000000000000000';
// const tnsAddress = "0xe47405AF3c470e91a02BFC46921C3632776F9C6b"; //mainnet
var tnsAddress = "0x62d6c93df120fca09a08258f3a644b5059aa12f0"; //ropsten

var utils = require('web3-utils');
var ethUtils = require('ethereumjs-util');
var fetch = require('node-fetch');

var RELAYER_URL = "https://relayer.tenzorum.app";
var isInitialised = false;

var zeroWei = 0;
var noData = exports.noData = "0x00";
var rewardTypeEther = exports.rewardTypeEther = "0x0000000000000000000000000000000000000000";
var tsnUri = exports.tsnUri = "http://tsnn.tenzorum.xyz:1888/tsnn";
var personalWalletABI = exports.personalWalletABI = [{ "constant": false, "inputs": [{ "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_data", "type": "bytes" }, { "name": "_rewardType", "type": "address" }, { "name": "_rewardAmount", "type": "uint256" }], "name": "execute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isActionAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "canLogIn", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMasterAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMasterAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "roles", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "removeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addActionAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "masterAccount", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }];
var noncesABI = exports.noncesABI = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];

var loveTokenAddresses = exports.loveTokenAddresses = {
    "mainnet": "0x00",
    "ropsten": "0x2134833ace155a1d54160fbe7d4651c4c67dc7f2",
    "rinkeby": "0xe35f264d1b22720524eb11a04b889a3d71308826"
};
var loveTokenAddress = void 0;
var privateKey = void 0;
var publicAddress = void 0;
var personalWalletAddress = void 0;
var isDebug = void 0;

/**
 * @desc initialise SDK
 * @method initSdk
 * @param  {Web3Module}  _web3
 * @param  {String}     _privateKey
 * @param  {String}    _personalWalletAddress
 * @param  {String}    _network
 */
var initSdk = function initSdk(_privateKey, _personalWalletAddress, _web3, _network) {
    console.log("Running on network: " + _network);
    if (!_web3) {
        web3.setProvider(new web3.providers.HttpProvider("https://" + _network + ".infura.io/rqmgop6P5BDFqz6yfGla"));
    } else {
        web3 = _web3;
    }
    personalWalletAddress = _personalWalletAddress;
    privateKey = Buffer.from(_privateKey, 'hex');
    publicAddress = ethUtils.bufferToHex(ethUtils.privateToAddress(privateKey));
    isInitialised = true;

    loveTokenAddress = loveTokenAddresses[_network];
};

var setDebugMode = exports.setDebugMode = function setDebugMode() {
    isDebug = true;
};

/**
 * @desc requests service node url
 * @method getTsn
 * @return {String}
 */
var getTsn = async function getTsn() {
    var response = await fetch(tsnUri);
    var json = await response.json();
    return json.tsn;
};

/**
 * @desc ENS resolver method for tenzID
 * @method checkEns
 * @param  {String}  input
 */
var checkEns = async function checkEns(input) {
    var ensContract = new web3.eth.Contract(tnsAbi, tnsAddress);
    try {
        return await ensContract.methods.subdomainTarget(input, 'tenz-id', 'xyz').call();
    } catch (e) {
        return "0x0000000000000000000000000000000000000000";
    }
};

/**
 * @desc deploy personal multisig with ENS
 * @method checkEns
 * @param  {String}  ens
 * @param  {String}  publicAddress
 */
var deployUserAccount = async function deployUserAccount(ens, publicAddress) {
    if (!utils.isAddress(publicAddress)) {
        throw new Error("Not a valid public address.");
    } else if (typeof ens !== "string") {
        throw new Error("ENS is not a string");
    }
    return await fetch(RELAYER_URL + "/deploy/" + publicAddress + "/" + ens);
};

/**
 * @desc checks user's access to personal wallet
 * @method checkAccess
 * @param  {String}  address
 * @param  {String}  personalWallet
 * @returns {Boolean}  true or false for access
 */

var checkAccess = async function checkAccess(address) {
    var personalWallet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : personalWalletAddress;

    var personalWalletABI = [{ "constant": false, "inputs": [{ "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_data", "type": "bytes" }, { "name": "_rewardType", "type": "address" }, { "name": "_rewardAmount", "type": "uint256" }], "name": "execute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isActionAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "canLogIn", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMasterAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMasterAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "roles", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "removeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addActionAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "masterAccount", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }];
    var walletInstance = new web3.eth.Contract(personalWalletABI, personalWallet);
    return await walletInstance.methods.canLogIn(address).call().catch(function (e) {
        return false;
    });
};

var preparePayload = async function preparePayload(targetWallet, from, to, value, data, rewardType, rewardAmount) {
    if (!isInitialised) console.log("ERROR: SDK not initialized");

    var noncesInstance = new web3.eth.Contract(noncesABI, targetWallet);
    var nonce = await noncesInstance.methods.nonces(from).call();
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

    if (isDebug) {
        console.log(JSON.stringify(payload));
    }

    return JSON.stringify(payload);
};

var prepareTokenTransferData = async function prepareTokenTransferData(amount, to) {
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

var prepareAddMasterData = async function prepareAddMasterData(account) {
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

var prepareAddActionData = async function prepareAddActionData(account) {
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

var prepareShareLoveData = exports.prepareShareLoveData = async function prepareShareLoveData(from, to, amount) {
    var encoded = await web3.eth.abi.encodeFunctionCall({
        name: 'shareLove',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'from'
        }, {
            type: 'address',
            name: 'to'
        }, {
            type: 'uint256',
            name: 'amount'
        }]
    }, [from, to, amount]);
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

/**
 * @desc gasless transaction call
 * @method relayTX
 * @param  {Object}  payload
 * @returns {String}  transaction hash
 */

var relayTx = async function relayTx(payload) {
    var targetAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : personalWalletAddress;

    var res = await fetch(RELAYER_URL + "/execute/" + targetAddress, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: payload
    });
    var json = JSON.parse((await res.text()));
    if (isDebug) {
        console.log(json);
    }
    return json;
};

var transferEtherNoReward = async function transferEtherNoReward(ethAmountInWei, toAddress) {
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, noData, rewardTypeEther, zeroWei)));
};

var transferEtherWithEtherReward = async function transferEtherWithEtherReward(ethAmountInWei, toAddress, rewardAmount) {
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, toAddress, ethAmountInWei, noData, rewardTypeEther, rewardAmount)));
};

var transferTokensNoReward = async function transferTokensNoReward(tokenAddress, amount, toAddress) {
    var data = await prepareTokenTransferData(amount, toAddress);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, tokenAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

var transferTokensWithTokenReward = async function transferTokensWithTokenReward(tokenAddress, amount, toAddress, rewardAmount) {
    var data = await prepareTokenTransferData(amount, toAddress);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, tokenAddress, zeroWei, data, tokenAddress, rewardAmount)));
};

var addMasterNoReward = async function addMasterNoReward(account) {
    var data = await prepareAddMasterData(account);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

var addActionNoReward = async function addActionNoReward(account) {
    var data = await prepareAddActionData(account);
    return relayTx((await preparePayload(personalWalletAddress, publicAddress, personalWalletAddress, zeroWei, data, rewardTypeEther, zeroWei)));
};

//For Love Token Only: https://github.com/Tenzorum/love-token
var shareLove = exports.shareLove = async function shareLove(toAddress, amount) {
    var data = await prepareShareLoveData(publicAddress, toAddress, amount);
    return relayTx((await preparePayload(loveTokenAddress, publicAddress, loveTokenAddress, zeroWei, data, rewardTypeEther, zeroWei)), loveTokenAddress);
};

//Using Love Token contract to create tenz-id as a meta-tx
var createTenzId = exports.createTenzId = async function createTenzId(subdomain, owner, target) {
    var data = await prepareCreateSubdomainData(subdomain, "tenz-id", "xyz", owner, target);
    return relayTx((await preparePayload(loveTokenAddress, publicAddress, loveTokenAddress, zeroWei, data, rewardTypeEther, zeroWei)), loveTokenAddress);
};

module.exports = {
    addActionNoReward: addActionNoReward,
    addMasterNoReward: addMasterNoReward,
    checkAccess: checkAccess,
    checkEns: checkEns,
    deployUserAccount: deployUserAccount,
    getTsn: getTsn,
    initSdk: initSdk,
    transferEtherNoReward: transferEtherNoReward,
    transferEtherWithEtherReward: transferEtherWithEtherReward,
    transferTokensNoReward: transferTokensNoReward,
    transferTokensWithTokenReward: transferTokensWithTokenReward,
    shareLove: shareLove,
    createTenzId: createTenzId,
    setDebugMode: setDebugMode
};