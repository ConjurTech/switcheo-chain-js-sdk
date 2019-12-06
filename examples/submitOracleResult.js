// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { BigNumber } = require('bignumber.js')

const mnemonic = 'bring dad camp afford develop share impose subject lunch flock riot area habit chalk pole try top put gossip hill token pony kiwi approve'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    OracleName: 'BTC_USD',
    Time: parseInt(Date.now() / 1000).toString(),
    Data: JSON.stringify(50000)
  }
  console.log(params)
  api.submitOracleResult(_wallet, params)
     .then(console.log)
})
