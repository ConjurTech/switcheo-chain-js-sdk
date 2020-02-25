export interface Network {
  REST_URL: string,
  COSMOS_URL: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

export const NETWORK = {
  DEVNET: {
    REST_URL: `http://13.250.103.204:5001`,
    COSMOS_URL: `http://13.250.103.204:1317`,
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:${port}`,
    COSMOS_URL: `http://${localhost}:1317`,
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
