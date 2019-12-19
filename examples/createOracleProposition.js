// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])
const voterKey = wallet.getPrivKeyFromMnemonic(mnemonics[2])

async function createOracleProposition() {
  const wallet = await Wallet.connect(privateKey)
  const voterWallet = await Wallet.connect(voterKey)
  const params = {
    OracleName: 'BTC_USD',
    Time: parseInt(Date.now() / 1000).toString(),
    Data: '50000',
    Voter: voterWallet.pubKeyBech32
  }
  api.createOracleProposition(wallet, params).then(console.log)
}

createOracleProposition()
