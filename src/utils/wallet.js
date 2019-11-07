const { Amino } = require('@node-a-team/ts-amino')
const secp256k1 = require('secp256k1')
const { sha256 } = require('sha.js')
const ripemd160 = require('ripemd160')
const bech32 = require('bech32')

const { marshalBinaryBare } = Amino

class PrivKeySecp256k1 {
  constructor(privKey) {
    this.privKey = privKey
  }

  toBytes() {
    return marshalBinaryBare(this)
  }

  toPubKey() {
    const pubKey = secp256k1.publicKeyCreate(
      Buffer.from(this.privKey),
      true
    );
    return new PubKeySecp256k1(pubKey);
  }

  equals(privKey) {
    return this.toBytes().toString() === privKey.toBytes().toString()
  }

  sign(msg) {
    return secp256k1.sign(
      Buffer.from(new sha256().update(msg).digest()),
      Buffer.from(this.privKey)
    ).signature
  }
}

class PubKeySecp256k1 {
  constructor(pubKey) {
    this.pubKey = pubKey;
  }

  toBytes() {
    return marshalBinaryBare(this);
  }

  toAddress() {
    let hash = new sha256().update(this.pubKey).digest('latin1')
    hash = new ripemd160().update(hash, 'latin1').digest('hex')

    return new Address(Buffer.from(hash, 'hex'))
  }

  equals(pubKey) {
    return this.toBytes().toString() === pubKey.toBytes().toString()
  }

  verify(msg, sig) {
    return secp256k1.verify(
      Buffer.from(msg),
      Buffer.from(sig),
      Buffer.from(this.pubKey),
    )
  }
}

class Address {
  constructor(address) {
    this.address = address
  }

  fromBech32(prefix, bech32Addr) {
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr)
    if (b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match")
    }
    return new Address(bech32.fromWords(words))
  }

  toBech32(prefix) {
    const words = bech32.toWords(Buffer.from(this.address))
    return bech32.encode(prefix, words)
  }

  toBytes() {
    return new Uint8Array(this.address)
  }
}

class BIP44 {
  constructor(purpose, coinType, account) {
    this.purpose = purpose
    this.coinType = coinType
    this.account = account
  }

  path(index, change = 0) {
    if (this.purpose !== parseInt(this.purpose.toString(), 10)) {
      throw new Error('Purpose should be integer')
    }
    if (this.coinType !== parseInt(this.coinType.toString(), 10)) {
      throw new Error('CoinType should be integer')
    }
    if (this.account !== parseInt(this.account.toString(), 10)) {
      throw new Error('Account should be integer')
    }
    if (change !== parseInt(change.toString(), 10)) {
      throw new Error('Change should be integer')
    }
    if (index !== parseInt(index.toString(), 10)) {
      throw new Error('Index should be integer')
    }

    return [this.purpose, this.coinType, this.account, change, index];
  }

  pathString(index, change = 0) {
    const path = this.path(index, change)
    return `m/${path[0]}'/${path[1]}'/${path[2]}'/${path[3]}/${path[4]}`
  }
}

module.exports = {
  BIP44,
  PrivKeySecp256k1,
}
