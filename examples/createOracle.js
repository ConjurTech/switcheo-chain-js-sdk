// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { BigNumber } = require('bignumber.js')
const mnemonics = require('../mnemonics.json')

const mnemonic = mnemonics[1]
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    OracleName: 'BTC_USD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinConsensusThreshold: '66'
  }
  console.log(params)
  api.createOracle(_wallet, params)
     .then(console.log)
})
