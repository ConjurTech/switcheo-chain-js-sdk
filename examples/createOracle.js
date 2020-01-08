// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function createOracle() {
  const wallet = await Wallet.connect(privateKey)
  const msg = {
    OracleName: 'BTC_USD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinConsensusThreshold: '66',
    SecurityType: 'SecuredByValidators',
    Resolution: '10',
    Spec: '{}',
  }
	api.createOracle(wallet, msg).then(console.log)
}

createOracle()
