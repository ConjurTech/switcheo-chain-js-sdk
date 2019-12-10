// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const mnemonics = require('../mnemonics.json')

const mnemonic = mnemonics[1]
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  _wallet.getAccount().then(({ result: { value } }) => {
    const { sequence } = value

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

  })
})
