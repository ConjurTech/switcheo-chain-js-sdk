// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])
const voterKey = wallet.getPrivKeyFromMnemonic(mnemonics[2])

/* NOT IMPLEMENTED YET
async function createOracleVoter() {
  const wallet = await Wallet.connect(privateKey)
  const voterWallet = await Wallet.connect(voterKey)

  const params = {
    OracleName: 'BTC_USD',
    Voter: voterWallet.pubKeyBech32
  }
  api.createOracleVoter(wallet, params).then(console.log)
}

createOracleVoter()
*/
