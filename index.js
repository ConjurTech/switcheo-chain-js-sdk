const mnemonics = require('./mnemonics.json')
const { start } = require('./examples/signAndBroadcast')

console.log(mnemonics)

setInterval(() => {
  console.log('starting....')
  const walletsLen = mnemonics.length
  // faux random normal distribution
  // e.g. if there are 20 wallets, it should generate a sample average value of 10 with a normal distribution
  let wallets = Math.round((((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3) * walletsLen + (walletsLen / 2))
  if (wallets < 0) {
    wallets = 0
  } else if (wallets > walletsLen) {
    wallets = walletsLen
  }

  for (let i = 0; i < 2; i++) {
    start(mnemonics[i], i)
  }

}, 1000)

// start(mnemonics[0], 1)
