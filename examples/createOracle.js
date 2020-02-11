// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function createOracle() {
  const wallet = await Wallet.connect(privateKey)
  const msg = {
    Name: 'BTC_USDxD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinConsensusThreshold: '67',
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
