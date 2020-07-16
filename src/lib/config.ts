export interface Network {
  REST_URL: string,
  RELAYER_URL: string,
  COSMOS_URL: string,
  ETH_ENV: string,
  ETH_WS_URL: string,
  BALANCE_READER_ADDRESS: string,
  WALLET_FACTORY_ADDRESS: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

interface NetworkInterface {
  [NET: string]: Network
}

export const NETWORK: NetworkInterface = {
  TESTNET: {
    REST_URL: `http://128.199.131.67:5001`,
    RELAYER_URL: `http://128.199.131.67:7001`,
    COSMOS_URL: `http://128.199.131.67:1317`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
    WALLET_FACTORY_ADDRESS: '0x86edf4748efeded37f4932b7de93a575909cc892',
  },
  DEVNET: {
    REST_URL: `http://13.251.218.38:5001`,
    RELAYER_URL: `http://13.251.218.38:7001`,
    COSMOS_URL: `http://13.251.218.38:1318`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
    WALLET_FACTORY_ADDRESS: '0x86edf4748efeded37f4932b7de93a575909cc892',
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:${port}`,
    RELAYER_URL: `http://${localhost}:7001`,
    COSMOS_URL: `http://${localhost}:1317`,
    ETH_ENV: 'ropsten',
    ETH_WS_URL: 'wss://ropsten.dagger.matic.network',
    BALANCE_READER_ADDRESS: '0xc08a56b059fb6776164a6499e3132efdbbfa15ca',
    WALLET_FACTORY_ADDRESS: '0x86edf4748efeded37f4932b7de93a575909cc892',
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}

export function getNetwork(net): Network {
  const network = NETWORK[net]
  if (!network) {
    throw new Error('network must be LOCALHOST/DEVNET/TESTNET')
  }
  return network
}
