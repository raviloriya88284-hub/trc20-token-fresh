/**
 * Check Balance of Specific Address
 * Check token balance for: TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o
 */

const TronWeb = require('tronweb');

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS_HERE';
const ADDRESS_TO_CHECK = 'TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o';
const NETWORK = process.env.NETWORK || 'mainnet';

const networks = {
  mainnet: { fullHost: 'https://api.trongrid.io' },
  shasta: { fullHost: 'https://api.shasta.trongrid.io' }
};

async function checkBalance() {
  try {
    console.log('💰 Checking Token Balance...\n');
    
    const tronWeb = new TronWeb({
      fullHost: networks[NETWORK].fullHost
    });
    
    console.log('📍 Address:', ADDRESS_TO_CHECK);
    console.log('📝 Contract:', CONTRACT_ADDRESS);
    console.log('🌐 Network:', NETWORK);
    console.log('');
    
    // Validate address
    if (!tronWeb.isAddress(ADDRESS_TO_CHECK)) {
      throw new Error('Invalid address format');
    }
    
    // Get contract instance
    const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
    
    // Get token info
    const name = await contract.name().call();
    const symbol = await contract.symbol().call();
    const decimals = await contract.decimals().call();
    
    console.log('📊 Token Information:');
    console.log('   Name:', name);
    console.log('   Symbol:', symbol);
    console.log('   Decimals:', decimals.toString());
    console.log('');
    
    // Get balance
    const rawBalance = await contract.balanceOf(ADDRESS_TO_CHECK).call();
    const decimalsNum = parseInt(decimals);
    const displayBalance = rawBalance / (10 ** decimalsNum);
    
    console.log('💰 Balance Information:');
    console.log('   Raw Balance:', rawBalance.toString());
    console.log('   Display Balance:', displayBalance, symbol);
    console.log('');
    
    // Check TRX balance too
    const trxBalance = await tronWeb.trx.getBalance(ADDRESS_TO_CHECK);
    const trxDisplay = trxBalance / 1000000; // TRX has 6 decimals
    
    console.log('💎 TRX Balance:', trxDisplay, 'TRX');
    console.log('');
    
    // TronScan link
    console.log('🔍 View on TronScan:');
    console.log(`   https://tronscan.org/#/address/${ADDRESS_TO_CHECK}`);
    console.log('');
    
    if (displayBalance > 0) {
      console.log('✅ Address has token balance!');
    } else {
      console.log('⚠️  Address has no token balance');
      console.log('   Send tokens to this address to enable auto-detection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   - Contract address is correct');
    console.error('   - Network is correct');
    console.error('   - Contract is deployed');
  }
}

if (require.main === module) {
  checkBalance();
}

module.exports = { checkBalance };

