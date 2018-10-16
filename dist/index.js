'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

var tnsAbi = [{ "anonymous": false, "inputs": [], "name": "DomainTransfersLocked", "type": "event" }, { "constant": false, "inputs": [], "name": "lockDomainOwnershipTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }, { "name": "_owner", "type": "address" }, { "name": "_target", "type": "address" }], "name": "newSubdomain", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousRegistry", "type": "address" }, { "indexed": true, "name": "newRegistry", "type": "address" }], "name": "RegistryUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "creator", "type": "address" }, { "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "subdomain", "type": "string" }, { "indexed": false, "name": "domain", "type": "string" }, { "indexed": false, "name": "topdomain", "type": "string" }], "name": "SubdomainCreated", "type": "event" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferContractOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousResolver", "type": "address" }, { "indexed": true, "name": "newResolver", "type": "address" }], "name": "ResolverUpdated", "type": "event" }, { "constant": false, "inputs": [{ "name": "_node", "type": "bytes32" }, { "name": "_owner", "type": "address" }], "name": "transferDomainOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_registry", "type": "address" }], "name": "updateRegistry", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_resolver", "type": "address" }], "name": "updateResolver", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_registry", "type": "address" }, { "name": "_resolver", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [{ "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "domainOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "locked", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "registry", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "resolver", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "subdomainOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_subdomain", "type": "string" }, { "name": "_domain", "type": "string" }, { "name": "_topdomain", "type": "string" }], "name": "subdomainTarget", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }];
var emptyAddress = '0x0000000000000000000000000000000000000000';
var tnsAddress = "0xe47405AF3c470e91a02BFC46921C3632776F9C6b"; //mainnet
// const tnsAddress = "0x62d6c93df120fca09a08258f3a644b5059aa12f0"; //ropsten

var utils = require('web3-utils');
var ethUtils = require('ethereumjs-util');
var fetch = require('node-fetch');

var RELAYER_URL = "https://relayer.tenzorum.app";
var isInitialised = false;

var zeroWei = 0;
var noData = exports.noData = "0x00";
var rewardTypeEther = exports.rewardTypeEther = "0x0000000000000000000000000000000000000000";
var tsnUri = exports.tsnUri = "http://tsnn.tenzorum.xyz:1888/tsnn";

var privateKey = void 0;
var publicAddress = void 0;
var personalWalletAddress = void 0;

/**
 * @desc initialise SDK
 * @method initSdk
 * @param  {Web3Module}  _web3
 * @param  {String}     _privateKey
 * @param  {String}    _personalWalletAddress
 * @param  {String}    _network
 */
var initSdk = function initSdk(_privateKey, _personalWalletAddress) {
    var _web3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : web3;

    var _network = arguments[3];

    web3 = _web3;
    personalWalletAddress = _personalWalletAddress;
    privateKey = Buffer.from(_privateKey, 'hex');
    publicAddress = ethUtils.bufferToHex(ethUtils.privateToAddress(privateKey));
    isInitialised = true;
    console.log('initialised?: ', isInitialised);

    //TODO: network feature for development usecases
    if (_network) console.log(_network);
    //  _network === "ropsten"
    //    contractAddress changes per network
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
    return await ensContract.subdomainOwner(input, 'tenz-id', 'xyz');
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
    return await fetch(RELAYER_URL + '/deploy/' + publicAddress + '/' + ens);
};

/**
 * @desc Gasless Transactions User Object
 * @class GaslessTransactions
 * @param  {String}  _ensName
 * @param  {String}  _personalWalletAddress
 */

var GaslessTransactions = function () {
    function GaslessTransactions(_ensName, _privateKey, _personalWalletAddress) {
        _classCallCheck(this, GaslessTransactions);

        this.ensName = _ensName;
        this.privateKey = _privateKey;
        this.personalWalletAddress = _personalWalletAddress;
        this.publicAddress = ethUtils.bufferToHex(ethUtils.privateToAddress(_privateKey));
    }

    _createClass(GaslessTransactions, null, [{
        key: 'relayTx',


        /**
         * @desc gasless transaction call
         * @method relayTX
         * @param  {Object}  payload
         * @returns {String}  transaction hash
         */

        value: async function relayTx(payload) {
            var res = await fetch(RELAYER_URL + '/execute/' + this.personalWalletAddress, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: payload
            });
            return JSON.parse((await res.text()));
        }
    }, {
        key: 'transferTokensNoReward',
        value: async function transferTokensNoReward(tokenAddress, amount, toAddress) {
            var data = await prepareTokenTransferData(amount, toAddress);
            return relayTx((await preparePayload(this.personalWalletAddress, this.publicAddress, tokenAddress, zeroWei, data, rewardTypeEther, zeroWei)));
        }

        /**
         * @desc checks user's access to personal wallet
         * @method checkAccess
         * @param  {String}  address
         * @param  {String}  personalWallet
         * @returns {Boolean}  true or false for access
         */

    }, {
        key: 'checkAccess',
        value: async function checkAccess(address) {
            var personalWallet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : personalWalletAddress;

            var personalWalletABI = [{ "constant": false, "inputs": [{ "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_data", "type": "bytes" }, { "name": "_rewardType", "type": "address" }, { "name": "_rewardAmount", "type": "uint256" }], "name": "execute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isActionAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "canLogIn", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMasterAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMasterAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "roles", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "removeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addActionAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "masterAccount", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }];
            var walletInstance = new web3.eth.Contract(personalWalletABI, personalWallet);
            return await walletInstance.methods.canLogIn(address).call().catch(function (e) {
                return false;
            });
        }
    }]);

    return GaslessTransactions;
}();

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

    var personalWalletABI = [{ "constant": false, "inputs": [{ "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_data", "type": "bytes" }, { "name": "_rewardType", "type": "address" }, { "name": "_rewardAmount", "type": "uint256" }], "name": "execute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isActionAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMasterAccount", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "roles", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "login", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "masterAccount", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }];
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

/**
 * @desc gasless transaction call
 * @method relayTX
 * @param  {Object}  payload
 * @returns {String}  transaction hash
 */

var relayTx = async function relayTx(payload) {
    var res = await fetch(RELAYER_URL + '/execute/' + personalWalletAddress, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: payload
    });
    return JSON.parse((await res.text()));
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

module.exports = {
    addActionNoReward: addActionNoReward,
    addMasterNoReward: addMasterNoReward,
    checkAccess: checkAccess,
    checkEns: checkEns,
    deployUserAccount: deployUserAccount,
    getTsn: getTsn,
    initSdk: initSdk,
    GaslessTransactions: GaslessTransactions,
    transferEtherNoReward: transferEtherNoReward,
    transferEtherWithEtherReward: transferEtherWithEtherReward,
    transferTokensNoReward: transferTokensNoReward,
    transferTokensWithTokenReward: transferTokensWithTokenReward
};