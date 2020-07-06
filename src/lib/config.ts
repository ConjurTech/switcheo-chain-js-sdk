export interface Network {
  REST_URL: string,
  SIGNUP_URL: string,
  ETH_ENV: string,
  ETH_WS_URL: string,
  BALANCE_READER_ADDRESS: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

export const NETWORK = {
  TESTNET: {
    REST_URL: `http://128.199.131.67:5001`,
    SIGNUP_URL: `http://128.199.131.67:7001`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
  },
  DEVNET: {
    REST_URL: `http://13.251.218.38:5001`,
    SIGNUP_URL: `http://13.251.218.38:7001`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:${port}`,
    SIGNUP_URL: `http://${localhost}:7001`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
