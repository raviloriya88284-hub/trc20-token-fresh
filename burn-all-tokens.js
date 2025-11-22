/**
 * Burn All Tokens Script
 * Burns all tokens from your address to make token inactive
 */

const TronWeb = require('tronweb');

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'TU1fiHg18p6ee5nVjh9zBfbBT9WCpYMDKf';
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';
const NETWORK = process.env.NETWORK || 'mainnet';

const networks = {
  mainnet: { fullHost: 'https://api.trongrid.io' },
  shasta: { fullHost: 'https://api.shasta.trongrid.io' }
};

async function burnAllTokens() {
  try {
    console.log('🔥 Burning All Tokens...\n');
    
    const tronWeb = new TronWeb({
      fullHost: networks[NETWORK].fullHost,
      privateKey: PRIVATE_KEY
    });
    
    const ownerAddress = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    console.log('📍 Owner Address:', ownerAddress);
    console.log('📝 Contract Address:', CONTRACT_ADDRESS);
    console.log('🌐 Network:', NETWORK);
    console.log('');
    
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
    
    // Get current balance
    const balance = await contract.balanceOf(ownerAddress).call();
    const decimalsNum = parseInt(decimals);
    const displayBalance = balance / (10 ** decimalsNum);
    
    console.log('💰 Current Balance:', displayBalance, symbol);
    console.log('   Raw Balance:', balance.toString());
    console.log('');
    
    if (balance == 0) {
      console.log('⚠️  No tokens to burn!');
      return;
    }
    
    // Confirm
    console.log('⚠️  WARNING: This will burn ALL your tokens!');
    console.log('   Amount:', displayBalance, symbol);
    console.log('   This action cannot be undone!');
    console.log('');
    
    // Uncomment to actually burn
    /*
    console.log('🔥 Burning tokens...');
    const tx = await contract.burn(balance).send();
    
    console.log('✅ Tokens burned successfully!');
    console.log('   Transaction:', tx);
    console.log('');
    console.log('🔍 Check on TronScan:');
    console.log(`   https://tronscan.org/#/transaction/${tx}`);
    console.log('');
    console.log('📊 New Balance: 0', symbol);
    console.log('   Token is now inactive');
    */
    
    console.log('💡 To actually burn, uncomment the burn code in script');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   - Contract address is correct');
    console.error('   - Private key is correct');
    console.error('   - You have tokens to burn');
    console.error('   - Contract is deployed');
  }
}

if (require.main === module) {
  if (!PRIVATE_KEY || PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
    console.error('❌ Please set PRIVATE_KEY environment variable');
    console.error('Usage:');
    console.error('  export PRIVATE_KEY=your_private_key');
    console.error('  export CONTRACT_ADDRESS=TU1fiHg18p6ee5nVjh9zBfbBT9WCpYMDKf');
    console.error('  node scripts/burn-all-tokens.js');
    process.exit(1);
  }
  burnAllTokens();
}

module.exports = { burnAllTokens };

