// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function run() {
  // eth address: 0x4fe49680ab2f24a74fca3e8d80da37bd8c4895a0
  // eth public key: 0x0460d242bda2fbc75bfad9d40257e3aea7728b18dd76f8854657fc5803b2790362f18e90d19f40acb88911a5723dbb3ce62eeb26b5915d77292fe1d7648097ed02
  const mnemonic = 'until nature color hospital marriage crime mask pluck romance globe hedgehog bench'
  const accountWallet = await Wallet.connect(mnemonic)

  const swthAccount = await accountWallet.getSwthAccountFromEthKey()
  console.log('swthAccount', swthAccount)

  const tokenReq = {
    address: swthAccount.address,
    amount: '1000',
    denom: 'swth',
  }
  const mintResult = await api.mintTokens(tokenReq)
  console.log('mintResult', mintResult)

  // pubkey 022abc240c21a6f2f964d7bed04cc030fdbf280de43b441fea2cf530ae8afd7c71
  const msg = {
    ID: 'BTC_USD_2',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinTurnoutPercentage: '67',
    MaxResultAge: '100',
    SecurityType: 'SecuredByValidators',
    ResultStrategy: 'median',
    Resolution: '10',
    Spec: '{}',
    Originator: swthAccount.address
  }
	api.createOracle(accountWallet, msg).then(console.log)
}

run()
