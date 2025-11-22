/**
 * Send Tokens to Specific Address
 * Helper script to send tokens to a wallet address
 */

const TronWeb = require('tronweb');

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS_HERE';
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';
const NETWORK = process.env.NETWORK || 'mainnet';

// Wallet address to send tokens to
const RECIPIENT_ADDRESS = 'TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o';

// Network configuration
const networks = {
  mainnet: {
    fullHost: 'https://api.trongrid.io'
  },
  shasta: {
    fullHost: 'https://api.shasta.trongrid.io'
  }
};

async function sendTokens(amount) {
  try {
    console.log('🚀 Sending Tokens...\n');
    
    // Initialize TronWeb
    const tronWeb = new TronWeb({
      fullHost: networks[NETWORK].fullHost,
      privateKey: PRIVATE_KEY
    });
    
    const senderAddress = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    console.log('📍 Sender Address:', senderAddress);
    console.log('📍 Recipient Address:', RECIPIENT_ADDRESS);
    console.log('📝 Contract Address:', CONTRACT_ADDRESS);
    console.log('🌐 Network:', NETWORK);
    console.log('');
    
    // Validate recipient address
    if (!tronWeb.isAddress(RECIPIENT_ADDRESS)) {
      throw new Error('Invalid recipient address');
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
    
    // Get sender balance
    const senderBalance = await contract.balanceOf(senderAddress).call();
    const decimalsNum = parseInt(decimals);
    const displayBalance = senderBalance / (10 ** decimalsNum);
    
    console.log('💰 Sender Balance:', displayBalance, symbol);
    console.log('');
    
    // Calculate amount in smallest unit
    const amountInSmallestUnit = amount * (10 ** decimalsNum);
    
    if (senderBalance < amountInSmallestUnit) {
      throw new Error(`Insufficient balance. You have ${displayBalance} ${symbol}, trying to send ${amount} ${symbol}`);
    }
    
    console.log(`💸 Sending ${amount} ${symbol} to ${RECIPIENT_ADDRESS}...`);
    console.log(`   Amount in smallest unit: ${amountInSmallestUnit}`);
    console.log('');
    
    // Send tokens
    const tx = await contract.transfer(RECIPIENT_ADDRESS, amountInSmallestUnit).send();
    
    console.log('✅ Transfer Successful!');
    console.log('   Transaction ID:', tx);
    console.log('');
    console.log('🔍 Check on TronScan:');
    console.log(`   https://tronscan.org/#/transaction/${tx}`);
    console.log('');
    console.log('📱 Recipient can check balance in wallet after a few minutes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   - Contract address is correct');
    console.error('   - Private key is correct');
    console.error('   - Network is correct');
    console.error('   - You have sufficient balance');
    console.error('   - Contract is deployed');
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const amount = args[0] ? parseFloat(args[0]) : 100; // Default 100 tokens
  
  if (!amount || amount <= 0) {
    console.error('❌ Please provide a valid amount');
    console.error('Usage: node send-to-address.js [amount]');
    console.error('Example: node send-to-address.js 100');
    process.exit(1);
  }
  
  sendTokens(amount);
}

module.exports = { sendTokens };

