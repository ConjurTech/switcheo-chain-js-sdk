// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function createOracle() {
  const wallet = await Wallet.connect(mnemonics[0])
  const msg = {
    ID: 'BTC_USD_xD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinConsensusThreshold: '67',
    MaxResultAge: '100',
    SecurityType: 'SecuredByValidators',
    ResultStrategy: 'median',
    Config: JSON.stringify({
      "median_threshold": '10'
    }),
    Resolution: '10',
    Spec: '{}',
  }
	api.createOracle(wallet, msg).then(console.log)
}

createOracle()
