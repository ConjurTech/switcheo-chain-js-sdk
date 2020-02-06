export interface Network {
  REST_URL: string
}

export const NETWORK = {
  DEVNET: {
    REST_URL: 'http://localhost:5001',
  },
  LOCALHOST: {
    REST_URL: 'http://localhost:5001',
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
