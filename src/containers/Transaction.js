const { CONFIG } = require('../config')

class Transaction {
  constructor(type, msg, signature, options = {}) {
    const fee = options.fee || { amount: [], gas: CONFIG.DEFAULT_GAS }
    const mode = options.mode || 'sync'
    this.tx = {
      msg: [{
        type,
        value: msg,
      }],
      fee,
      signatures: [signature],
    }
    this.mode = mode
  }
}

module.exports = {
  Transaction,
}
