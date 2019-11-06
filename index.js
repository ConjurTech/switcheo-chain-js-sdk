const { getWallet } = require('./src/wallet')
const { CreateOrderMsg } = require('./src/msgs/orders')
const { MintTokenMsg } = require('./src/msgs/mints')
const { Transaction } = require('./src/containers/Transaction')
const types = require('./src/types')

module.exports = {
  connect: getWallet,
  CreateOrderMsg,
  MintTokenMsg,
  Transaction,
  types,
}
