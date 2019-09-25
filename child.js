const { start } = require('./examples/signAndBroadcast')

module.exports = function (inp, callback) {
  // console.log(inp)
  // callback(null, inp + ' BAR (' + process.pid + ')')
  const { mnemonic, accountNumber } = inp
  start(mnemonic, accountNumber).then(() => {
    callback(null, `${accountNumber} done`)
  })
}
