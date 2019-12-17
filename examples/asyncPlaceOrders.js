// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function asyncPlaceOrders() {
  const _wallet = await wallet.Wallet.connect(privateKey)
  const sequence = await _wallet.getAccount().result.value.sequence
  const params = {
    Market: 'swth_eth',
    Side: 'buy',
    Quantity: '100',
    Price: '0.01',
  }
  const firstSequence = sequence
  const secondSequence = (parseInt(sequence) + 1).toString()

  api.placeOrder(_wallet, params, { mode: 'async', sequence: firstSequence })
    .then(console.log)
  api.placeOrder(_wallet, params, { mode: 'async', sequence: secondSequence })
    .then(console.log)
}
asyncPlaceOrders()
