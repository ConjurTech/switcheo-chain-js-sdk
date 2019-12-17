// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function createOracleResult() {
  const wallet = await Wallet.connect(privateKey)
  const params = {
    OracleName: 'BTC_USD',
    Time: parseInt(Date.now() / 1000).toString(),
    Data: JSON.stringify(50000)
  }
  api.createOracleResult(wallet, params).then(console.log)
}

createOracleResult()
