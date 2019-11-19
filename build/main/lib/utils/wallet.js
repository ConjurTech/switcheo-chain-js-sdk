"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
var bech32_1 = __importDefault(require("bech32"));
var ripemd160_1 = __importDefault(require("ripemd160"));
var secp256k1_1 = __importDefault(require("secp256k1"));
var sha_js_1 = require("sha.js");
var PrivKeySecp256k1 = /** @class */ (function () {
    function PrivKeySecp256k1(privKey) {
        this.privKey = privKey;
    }
    PrivKeySecp256k1.prototype.toBytes = function () {
        // return marshalBinaryBare(this) // stub marshalBinaryBare with Uint8Array
        return new Uint8Array(this.privKey);
    };
    PrivKeySecp256k1.prototype.toPubKey = function () {
        var pubKey = secp256k1_1.default.publicKeyCreate(Buffer.from(this.privKey), true);
        return new PubKeySecp256k1(pubKey);
    };
    PrivKeySecp256k1.prototype.equals = function (privKey) {
        return this.toBytes().toString() === privKey.toBytes().toString();
    };
    PrivKeySecp256k1.prototype.sign = function (msg) {
        return secp256k1_1.default.sign(Buffer.from(new sha_js_1.sha256().update(msg).digest()), Buffer.from(this.privKey)).signature;
    };
    return PrivKeySecp256k1;
}());
exports.PrivKeySecp256k1 = PrivKeySecp256k1;
var PubKeySecp256k1 = /** @class */ (function () {
    function PubKeySecp256k1(pubKey) {
        this.pubKey = pubKey;
    }
    PubKeySecp256k1.prototype.toBytes = function () {
        // return marshalBinaryBare(this)
        return new Uint8Array(this.pubKey);
    };
    PubKeySecp256k1.prototype.toAddress = function () {
        var hash = new sha_js_1.sha256().update(this.pubKey).digest('latin1');
        hash = new ripemd160_1.default().update(hash, 'latin1').digest('hex');
        return new Address(Buffer.from(hash, 'hex'));
    };
    PubKeySecp256k1.prototype.equals = function (pubKey) {
        return this.toBytes().toString() === pubKey.toBytes().toString();
    };
    PubKeySecp256k1.prototype.verify = function (msg, sig) {
        return secp256k1_1.default.verify(Buffer.from(msg), Buffer.from(sig), Buffer.from(this.pubKey));
    };
    return PubKeySecp256k1;
}());
exports.PubKeySecp256k1 = PubKeySecp256k1;
var Address = /** @class */ (function () {
    function Address(address) {
        this.address = address;
    }
    Address.prototype.fromBech32 = function (prefix, bech32Addr) {
        var _a = bech32_1.default.decode(bech32Addr), b32Prefix = _a.prefix, words = _a.words;
        if (b32Prefix !== prefix) {
            throw new Error("Prefix doesn't match");
        }
        return new Address(bech32_1.default.fromWords(words));
    };
    Address.prototype.toBech32 = function (prefix) {
        var words = bech32_1.default.toWords(Buffer.from(this.address));
        return bech32_1.default.encode(prefix, words);
    };
    Address.prototype.toBytes = function () {
        return new Uint8Array(this.address);
    };
    return Address;
}());
var BIP44 = /** @class */ (function () {
    function BIP44(purpose, coinType, account) {
        this.purpose = purpose;
        this.coinType = coinType;
        this.account = account;
    }
    BIP44.prototype.path = function (index, change) {
        if (change === void 0) { change = 0; }
        if (this.purpose !== parseInt(this.purpose.toString(), 10)) {
            throw new Error('Purpose should be integer');
        }
        if (this.coinType !== parseInt(this.coinType.toString(), 10)) {
            throw new Error('CoinType should be integer');
        }
        if (this.account !== parseInt(this.account.toString(), 10)) {
            throw new Error('Account should be integer');
        }
        if (change !== parseInt(change.toString(), 10)) {
            throw new Error('Change should be integer');
        }
        if (index !== parseInt(index.toString(), 10)) {
            throw new Error('Index should be integer');
        }
        return [this.purpose, this.coinType, this.account, change, index];
    };
    BIP44.prototype.pathString = function (index, change) {
        if (change === void 0) { change = 0; }
        var path = this.path(index, change);
        return "m/" + path[0] + "'/" + path[1] + "'/" + path[2] + "'/" + path[3] + "/" + path[4];
    };
    return BIP44;
}());
function getPath() {
    var bip44 = new BIP44(44, 118, 0);
    var index = 0;
    var change = 0;
    return bip44.pathString(index, change);
}
exports.getPath = getPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy93YWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsa0RBQTJCO0FBQzNCLHdEQUFpQztBQUNqQyx3REFBaUM7QUFDakMsaUNBQStCO0FBRS9CO0lBRUUsMEJBQVksT0FBTztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtJQUN4QixDQUFDO0lBRU0sa0NBQU8sR0FBZDtRQUNFLDJFQUEyRTtRQUMzRSxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0lBRU0sbUNBQVEsR0FBZjtRQUNFLElBQU0sTUFBTSxHQUFHLG1CQUFTLENBQUMsZUFBZSxDQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFDekIsSUFBSSxDQUNMLENBQUM7UUFDRixPQUFPLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTSxpQ0FBTSxHQUFiLFVBQWMsT0FBTztRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUE7SUFDbkUsQ0FBQztJQUVNLCtCQUFJLEdBQVgsVUFBWSxHQUFHO1FBQ2IsT0FBTyxtQkFBUyxDQUFDLElBQUksQ0FDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDMUIsQ0FBQyxTQUFTLENBQUE7SUFDYixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBN0JZ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