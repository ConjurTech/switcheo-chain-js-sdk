// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

const privateKey = wallet.getPrivKeyFromMnemonic("slogan text pig seed trust link series banner foam affair sing citizen wire slice level sword exchange tape quiz away win silly siege home")

async function upgradeSWTH() {
  const validators = (await accountWallet.getValidators()).result

  await api.mintTokens({
    address: 'cosmos1flqfs2dzzkrf49aj5pg0nj340jdqzgje02smww',
    amount: '100',
    denom: 'swth',
  }).then(console.log)
  const wallet = await Wallet.connect(privateKey)
  const params = {
    NeoTxHash: 'f'.repeat(64),
    NeoAddress: 'a'.repeat(40),
    AccAddress: 'cosmos176mpu36q5mmxy079rtrch5eq362wln0qyfn4u5', // canvas inner salmon artwork certain caution avocado toe sick arctic again vocal lyrics shield throw help reject permit giggle split timber wish category praise
    Amount: '42' + '0'.repeat(8),
    ValAddress: validators[0].operator_address,
  }
  api.upgradeSWTH(wallet, params).then(console.log)
}

upgradeSWTH()
