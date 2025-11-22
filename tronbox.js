module.exports = {
  networks: {
    development: {
      privateKey: 'd74427a0abf6dc8ba9a604d6424ff0e62551df1bfca339c3b1b47c3983f27371',
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '*'
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY || 'd74427a0abf6dc8ba9a604d6424ff0e62551df1bfca339c3b1b47c3983f27371',
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '*'
    },
    mainnet: {
      privateKey: process.env.PRIVATE_KEY || 'd74427a0abf6dc8ba9a604d6424ff0e62551df1bfca339c3b1b47c3983f27371',
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.trongrid.io',
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: '0.8.0',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

