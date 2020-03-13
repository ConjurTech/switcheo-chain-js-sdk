export interface Network {
  REST_URL: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

export const NETWORK = {
  DEVNET: {
    REST_URL: `http://13.251.218.38:5001`,
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:${port}`,
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
