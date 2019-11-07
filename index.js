const { connect, connectWithPrivKey, newAccount, sign, signWithMnemonic, getPrivKey } = require('./src/wallet')
const { CreateOrderMsg } = require('./src/msgs/orders')
const { MintTokenMsg } = require('./src/msgs/mints')
const { Transaction } = require('./src/containers/Transaction')
const { StdSignDoc } = require('./src/containers/StdSignDoc')
const { marshalJSON } = require('./src/utils/encoder')
const types = require('./src/types')
const { generateWalletFromMnemonic, BIP44 } = require('./src/utils/wallet')

module.exports = {
  connect,
  connectWithPrivKey,
  newAccount,
  CreateOrderMsg,
  MintTokenMsg,
  Transaction,
  types,
  generateWalletFromMnemonic,
  BIP44,
  StdSignDoc,
  sign,
  signWithMnemonic,
  marshalJSON,
  getPrivKey,
}
