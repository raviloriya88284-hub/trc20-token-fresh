/**
 * Script to check token balance and verify calculation
 * Helps verify that balance display will work correctly in wallets
 */

const TronWeb = require('tronweb');

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS_HERE';
const ADDRESS_TO_CHECK = process.env.ADDRESS_TO_CHECK || 'YOUR_ADDRESS_HERE';
const NETWORK = process.env.NETWORK || 'mainnet';

const networks = {
  mainnet: { fullHost: 'https://api.trongrid.io' },
  shasta: { fullHost: 'https://api.shasta.trongrid.io' }
};

async function checkBalance() {
  try {
    console.log('💰 Checking Token Balance & Calculation...\n');
    
    const tronWeb = new TronWeb({
      fullHost: networks[NETWORK].fullHost
    });
    
    console.log('📍 Address to Check:', ADDRESS_TO_CHECK);
    console.log('📝 Contract Address:', CONTRACT_ADDRESS);
    console.log('🌐 Network:', NETWORK);
    console.log('');
    
    // Get contract instance
    const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
    
    // Get token info
    const name = await contract.name().call();
    const symbol = await contract.symbol().call();
    const decimals = await contract.decimals().call();
    const totalSupply = await contract.totalSupply().call();
    
    console.log('📊 Token Information:');
    console.log('   Name:', name);
    console.log('   Symbol:', symbol);
    console.log('   Decimals:', decimals.toString());
    console.log('   Total Supply:', totalSupply.toString());
    console.log('');
    
    // Get balance
    const rawBalance = await contract.balanceOf(ADDRESS_TO_CHECK).call();
    const decimalsNum = parseInt(decimals);
    const displayBalance = rawBalance / (10 ** decimalsNum);
    
    console.log('💰 Balance Information:');
    console.log('   Raw Balance (from contract):', rawBalance.toString());
    console.log('   Decimals:', decimalsNum);
    console.log('   Display Balance:', displayBalance, symbol);
    console.log('');
    
    // Calculation breakdown
    console.log('🧮 Calculation Breakdown:');
    console.log(`   ${rawBalance.toString()} / (10 ^ ${decimalsNum}) = ${displayBalance} ${symbol}`);
    console.log('');
    
    // Wallet display info
    console.log('📱 Wallet Display:');
    console.log(`   Your wallet will show: ${displayBalance} ${symbol}`);
    console.log('   This is what appears in main balance section');
    console.log('');
    
    // Verify calculation
    const calculatedRaw = Math.floor(displayBalance * (10 ** decimalsNum));
    if (calculatedRaw.toString() === rawBalance.toString()) {
      console.log('✅ Balance calculation is CORRECT');
    } else {
      console.log('⚠️  Balance calculation check (minor rounding differences are normal)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Make sure:');
    console.error('   - Contract address is correct');
    console.error('   - Address to check is correct');
    console.error('   - Network is correct');
    console.error('   - Contract is deployed');
  }
}

if (require.main === module) {
  checkBalance();
}

module.exports = { checkBalance };

