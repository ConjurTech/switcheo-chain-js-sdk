// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { BigNumber } = require('bignumber.js')

// const mnemonic = 'swamp opinion jewel tuition cook harvest game weird walk ridge giraffe crystal ridge lock betray path sleep mango tide sell fashion elegant transfer mosquito'
const mnemonic = 'coin chuckle empty sponsor demise foil ignore pilot draw rally chair solution eyebrow donate raccoon main second outdoor crowd impact frozen stamp wonder stay'
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
