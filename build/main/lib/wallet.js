"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bip32 = __importStar(require("bip32"));
var bip39 = __importStar(require("bip39"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var config_1 = require("./config");
var containers_1 = require("./containers");
var encoder_1 = require("./utils/encoder");
var wallet_1 = require("./utils/wallet");
var Wallet = /** @class */ (function () {
    function Wallet(privateKey, accountNumber, network) {
        var privKey = new wallet_1.PrivKeySecp256k1(Buffer.from(privateKey, 'hex'));
        this.privKey = privKey;
        this.address = privKey.toPubKey().toAddress().toBytes();
        this.pubKeySecp256k1 = privKey.toPubKey();
        this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64');
        this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmos');
        this.gas = config_1.CONFIG.DEFAULT_GAS;
        this.accountNumber = accountNumber;
        this.network = network;
    }
    Wallet.connect = function (privateKey, net) {
        if (net === void 0) { net = 'LOCALHOST'; }
        return __awaiter(this, void 0, void 0, function () {
            var network, pubKeyBech32, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        network = config_1.NETWORK[net];
                        if (!network) {
                            throw new Error('network must be LOCALHOST/DEVNET');
                        }
                        pubKeyBech32 = new wallet_1.PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32('cosmos');
                        return [4 /*yield*/, node_fetch_1.default(network.REST_URL + "/auth/accounts/" + pubKeyBech32)
                                .then(function (res) { return res.json(); })];
                    case 1:
                        value = (_a.sent()).result.value;
                        return [2 /*return*/, new Wallet(privateKey, value.account_number, network)];
                }
            });
        });
    };
    Wallet.prototype.sign = function (message) {
        var privKey = this.privKey;
        var data = privKey.sign(message);
        var signatureBase64 = data.toString('base64');
        return {
            pub_key: {
                type: 'tendermint/PubKeySecp256k1',
                value: this.pubKeyBase64,
            },
            signature: signatureBase64,
        };
    };
    Wallet.prototype.broadcast = function (body) {
        return node_fetch_1.default(this.network.REST_URL + "/txs", { method: 'POST', body: JSON.stringify(body) })
            .then(function (res) { return res.json(); }); // expecting a json response
    };
    Wallet.prototype.getAccount = function () {
        return node_fetch_1.default(this.network.REST_URL + "/auth/accounts/" + this.pubKeyBech32)
            .then(function (res) { return res.json(); }); // expecting a json response
    };
    Wallet.prototype.signMessage = function (msg, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sequence, result, memo, stdSignMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sequence = options.sequence;
                        if (!!sequence) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAccount()];
                    case 1:
                        result = (_a.sent()).result;
                        sequence = result.value.sequence;
                        _a.label = 2;
                    case 2:
                        memo = options.memo || '';
                        stdSignMsg = new containers_1.StdSignDoc({
                            accountNumber: this.accountNumber,
                            chainId: config_1.CONFIG.CHAIN_ID,
                            fee: new containers_1.Fee([], this.gas),
                            memo: memo,
                            msgs: [
                                msg,
                            ],
                            sequence: sequence,
                        });
                        return [2 /*return*/, this.sign(encoder_1.marshalJSON(stdSignMsg))];
                }
            });
        });
    };
    return Wallet;
}());
exports.Wallet = Wallet;
function newAccount() {
    var mnemonic = bip39.generateMnemonic();
    return {
        mnemonic: mnemonic,
        privateKey: getPrivKeyFromMnemonic(mnemonic),
    };
}
exports.newAccount = newAccount;
function getPrivKeyFromMnemonic(mnemonic) {
    var path = wallet_1.getPath();
    var seed = bip39.mnemonicToSeedSync(mnemonic, '');
    var masterKey = bip32.fromSeed(seed);
    var hd = masterKey.derivePath(path);
    var privateKey = hd.privateKey;
    if (!privateKey) {
        throw new Error("null hd key");
    }
    return privateKey.toString('hex');
}
exports.getPrivKeyFromMnemonic = getPrivKeyFromMnemonic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93YWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQThCO0FBQzlCLDJDQUE4QjtBQUM5QiwwREFBOEI7QUFDOUIsbUNBQW1EO0FBQ25ELDJDQUE4QztBQUM5QywyQ0FBNkM7QUFDN0MseUNBQTJFO0FBSTNFO0lBc0JFLGdCQUFZLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTztRQUM1QyxJQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFFcEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDdkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN2RSxJQUFJLENBQUMsR0FBRyxHQUFHLGVBQU0sQ0FBQyxXQUFXLENBQUE7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQWhDbUIsY0FBTyxHQUEzQixVQUE0QixVQUFrQixFQUFFLEdBQWlCO1FBQWpCLG9CQUFBLEVB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