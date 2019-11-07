const { connect, newAccount, getPrivKeyFromMnemonic } = require('./src/wallet')
const { CreateOrderMsg } = require('./src/msgs/orders')
const { MintTokenMsg } = require('./src/msgs/mints')
const { Transaction } = require('./src/containers/Transaction')
const { StdSignDoc } = require('./src/containers/StdSignDoc')
const { marshalJSON } = require('./src/utils/encoder')
const types = require('./src/types')
const { BIP44 } = require('./src/utils/wallet')

module.exports = {
  connect,
  newAccount,
  CreateOrderMsg,
  MintTokenMsg,
  Transaction,
  types,
  BIP44,
  StdSignDoc,
  marshalJSON,
  getPrivKeyFromMnemonic,
}
