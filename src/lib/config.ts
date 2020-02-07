export interface Network {
  REST_URL: string
}

const localhost = process.env.CHAIN_HOST || '127.0.0.1'

export const NETWORK = {
  DEVNET: {
    REST_URL: 'http://13.250.103.204:5001',
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:5001`,
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
