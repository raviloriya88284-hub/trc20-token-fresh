/**
 * Check TRX Balance
 * Quick script to check TRX balance for deployment
 */

const TronWeb = require('tronweb');

// Configuration
// Get address from command line argument or environment variable
const args = process.argv.slice(2);
const ADDRESS_TO_CHECK = args[0] || process.env.ADDRESS || 'TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o';
const NETWORK = args[1] || process.env.NETWORK || 'mainnet';

const networks = {
  mainnet: { fullHost: 'https://api.trongrid.io' },
  shasta: { fullHost: 'https://api.shasta.trongrid.io' }
};

async function checkTRXBalance() {
  try {
    console.log('💰 Checking TRX Balance...\n');
    
    const tronWeb = new TronWeb({
      fullHost: networks[NETWORK].fullHost
    });
    
    console.log('📍 Address:', ADDRESS_TO_CHECK);
    console.log('🌐 Network:', NETWORK);
    console.log('');
    
    // Validate address
    if (!tronWeb.isAddress(ADDRESS_TO_CHECK)) {
      throw new Error('Invalid address format');
    }
    
    // Get TRX balance
    const balance = await tronWeb.trx.getBalance(ADDRESS_TO_CHECK);
    const trxBalance = balance / 1000000; // TRX has 6 decimals
    
    console.log('💎 TRX Balance:', trxBalance, 'TRX');
    console.log('');
    
    // Check if sufficient for deployment
    if (NETWORK === 'shasta') {
      console.log('📊 Testnet (Shasta) Requirements:');
      console.log('   Minimum: 10,000 test TRX (free from faucet)');
      console.log('   Your balance:', trxBalance, 'TRX');
      if (trxBalance >= 10000) {
        console.log('   ✅ Sufficient for deployment!');
      } else {
        console.log('   ⚠️  Get more test TRX from faucet:');
        console.log('      https://www.trongrid.io/faucet');
      }
    } else {
      console.log('📊 Mainnet Requirements:');
      console.log('   Recommended: 100-200 TRX');
      console.log('   Your balance:', trxBalance, 'TRX');
      if (trxBalance >= 100) {
        console.log('   ✅ Sufficient for deployment!');
      } else if (trxBalance >= 50) {
        console.log('   ⚠️  Low balance - might need more');
      } else {
        console.log('   ❌ Insufficient balance');
        console.log('   Get more TRX from exchange');
      }
    }
    
    console.log('');
    console.log('🔍 View on TronScan:');
    console.log(`   https://tronscan.org/#/address/${ADDRESS_TO_CHECK}`);
    console.log('');
    
    // Get account resources (energy/bandwidth)
    try {
      const account = await tronWeb.trx.getAccountResources(ADDRESS_TO_CHECK);
      if (account) {
        console.log('⚡ Account Resources:');
        if (account.EnergyLimit) {
          console.log('   Energy Limit:', account.EnergyLimit);
          console.log('   Energy Used:', account.EnergyUsed || 0);
          console.log('   Energy Available:', (account.EnergyLimit || 0) - (account.EnergyUsed || 0));
        }
        if (account.freeNetLimit) {
          console.log('   Bandwidth Limit:', account.freeNetLimit);
          console.log('   Bandwidth Used:', account.freeNetUsed || 0);
        }
        console.log('');
      }
    } catch (e) {
      // Resources not available, skip
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   - Address is correct');
    console.error('   - Network is correct');
    console.error('   - Address format is valid (starts with T)');
  }
}

if (require.main === module) {
  // Allow address as command line argument
  if (ADDRESS_TO_CHECK && ADDRESS_TO_CHECK !== 'YOUR_ADDRESS_HERE') {
    checkTRXBalance();
  } else {
    console.error('❌ Please provide address');
    console.error('');
    console.error('Usage (Windows PowerShell):');
    console.error('  $env:ADDRESS="your_address"');
    console.error('  $env:NETWORK="shasta"');
    console.error('  npm run check-trx');
    console.error('');
    console.error('Or with address as argument:');
    console.error('  node scripts/check-trx-balance.js YOUR_ADDRESS shasta');
    console.error('');
    console.error('Example:');
    console.error('  node scripts/check-trx-balance.js TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o shasta');
    process.exit(1);
  }
}

module.exports = { checkTRXBalance };

