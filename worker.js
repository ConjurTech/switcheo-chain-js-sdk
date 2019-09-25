const workerFarm = require('worker-farm')
const mnemonics = require('./mnemonics')

const workers = workerFarm(require.resolve('./child'))
let ret = 0

for (var i = 0; i < mnemonics.length; i++) {
  // const input = `#${i} FOO`
  const input = {
    mnemonic: mnemonics[i],
    accountNumber: i + 1,
  }
  workers(input, function (err, outp) {
    // console.log(outp)
    if (++ret == mnemonics.length)
      workerFarm.end(workers)
  })
}
