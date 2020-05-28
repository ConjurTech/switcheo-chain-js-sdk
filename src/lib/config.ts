export interface Network {
  REST_URL: string,
  SIGNUP_URL: string,
}

const localhost = process.env.REST_HOST || '127.0.0.1'
const port = process.env.REST_PORT || '5001'

export const NETWORK = {
  TestNet: {
    REST_URL: `http://13.251.218.38:5001`,
    SIGNUP_URL: `http://13.251.218.38:7001`,
  },
  DEVNET: {
    REST_URL: `http://13.251.218.38:5001`,
    SIGNUP_URL: `http://13.251.218.38:7001`,
  },
  LOCALHOST: {
    REST_URL: `http://${localhost}:${port}`,
    SIGNUP_URL: `http://${localhost}:7001`,
  },
}

export const CONFIG = {
  CHAIN_ID: 'switcheochain',
  DEFAULT_GAS: '1000000000000', // TOOD: make this configurable
}
