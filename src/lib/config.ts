export interface Network {
  REST_URL: string
  RPC_URL: string
}

export const NETWORK = {
  DEVNET: {
    REST_URL: 'http://13.250.103.204:1318',
    RPC_URL: 'http://13.250.103.204:26657',
  },
  LOCALHOST: {
    REST_URL: 'http://localhost:1317',
    RPC_URL: 'http://localhost:26657',
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}

