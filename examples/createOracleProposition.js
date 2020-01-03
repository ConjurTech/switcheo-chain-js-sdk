// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function createOracleProposition() {
  const wallet = await Wallet.connect(privateKey)
  const params = {
    OracleName: 'BTC_USD',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    Timestamp: '1577441295',
    Data: '50000'
||||||| constructed merge base
    Time: parseInt(Date.now() / 1000).toString(),
    Data: '50000',
    Voter: voterWallet.pubKeyBech32
=======
    Time: parseInt(Date.now() / 1000).toString(),
||||||| constructed merge base
    Time: parseInt(Date.now() / 1000).toString(),
=======
    Timestamp: parseInt(Date.now() / 1000).toString(),
>>>>>>> naming
||||||| constructed merge base
    Timestamp: parseInt(Date.now() / 1000).toString(),
=======
    Timestamp: '1577441295',
>>>>>>> hardcode timestamp in examples;
    Data: '50000'
>>>>>>> remove voter field in CreatePropositionMsg
||||||| 4bc461f
    Time: parseInt(Date.now() / 1000).toString(),
    Data: '50000',
    Voter: voterWallet.pubKeyBech32
=======
    Timestamp: '1577441295',
    Data: '50000'
>>>>>>> 5fe5bab725f30871c5b4a7a63a72cc74c6d3eb38
  }
  api.createOracleProposition(wallet, params).then(console.log)
}

createOracleProposition()
