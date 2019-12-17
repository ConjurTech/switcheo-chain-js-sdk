// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function asyncPlaceOrders() {
  const wallet = await Wallet.connect(privateKey)
  const sequence = (await wallet.getAccount()).result.value.sequence
  const params = {
    Market: 'swth_eth',
    Side: 'buy',
    Quantity: '100',
    Price: '0.01',
  }
  const firstSequence = sequence
  const secondSequence = (parseInt(sequence) + 1).toString()

  api.placeOrder(wallet, params, { mode: 'async', sequence: firstSequence })
    .then(console.log)
  api.placeOrder(wallet, params, { mode: 'async', sequence: secondSequence })
    .then(console.log)
}
asyncPlaceOrders()
