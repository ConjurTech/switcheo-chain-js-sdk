// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function createOracleProposition() { //
  const wallet = await Wallet.connect(privateKey)
  const params = {
    OracleName: 'BTC_USD',
<<<<<<< HEAD
    Timestamp: '1577441295',
    Data: '50000'
||||||| constructed merge base
    Time: parseInt(Date.now() / 1000).toString(),
    Data: '50000',
    Voter: voterWallet.pubKeyBech32
=======
    Time: parseInt(Date.now() / 1000).toString(),
    Data: '50000'
>>>>>>> remove voter field in CreatePropositionMsg
  }
  api.createOracleProposition(wallet, params).then(console.log)
}

createOracleProposition()
