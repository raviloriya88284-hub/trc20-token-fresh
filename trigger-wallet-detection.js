/**
 * Script to trigger wallet auto-detection
 * Makes initial transfers to help wallets detect the token
 */

const TronWeb = require('tronweb');

// Configuration
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE'; // Replace with your deployed contract address
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';
const NETWORK = process.env.NETWORK || 'mainnet'; // 'mainnet' or 'shasta'

// Network configuration
const networks = {
  mainnet: {
    fullHost: 'https://api.trongrid.io'
  },
  shasta: {
    fullHost: 'https://api.shasta.trongrid.io'
  }
};

async function triggerWalletDetection() {
  try {
    console.log('🚀 Starting Wallet Auto-Detection Trigger...\n');
    
    // Initialize TronWeb
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
    const totalSupply = await contract.totalSupply().call();
    
    console.log('📊 Token Information:');
    console.log('   Name:', name);
    console.log('   Symbol:', symbol);
    console.log('   Decimals:', decimals.toString());
    console.log('   Total Supply:', totalSupply.toString());
    console.log('');
    
    // Get owner balance
    const ownerBalance = await contract.balanceOf(ownerAddress).call();
    console.log('💰 Owner Balance:', ownerBalance.toString());
    console.log('');
    
    // Make small test transfers to trigger wallet detection
    // Wallets detect tokens after transfers occur
    console.log('🔄 Making test transfers to trigger wallet detection...');
    console.log('   (Wallets auto-detect tokens after transfers)');
    console.log('');
    
    // Test addresses for auto-detection (modify as needed)
    const testAddresses = [
      'TWgkLC1QYWnbX75QWr3vMu4ZzP9TWYnL5o', // Your wallet address
      // Add more addresses here for multiple transfers
      // 'TAnotherAddress1XXXXXXXXXXXXXXXXXXXXXX',
      // 'TAnotherAddress2XXXXXXXXXXXXXXXXXXXXXX',
    ];
    
    // Small amount for testing (adjust based on your token decimals)
    const testAmount = 100 * (10 ** parseInt(decimals)); // 100 tokens
    
    if (ownerBalance < testAmount * testAddresses.length) {
      console.log('⚠️  Insufficient balance for test transfers');
      console.log('   Make sure you have enough tokens');
      return;
    }
    
    // Make transfers (commented out for safety - uncomment when ready)
    /*
    for (let i = 0; i < testAddresses.length; i++) {
      try {
        console.log(`   Transferring to ${testAddresses[i]}...`);
        const tx = await contract.transfer(testAddresses[i], testAmount).send();
        console.log(`   ✅ Transfer ${i + 1} successful: ${tx}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      } catch (error) {
        console.log(`   ❌ Transfer ${i + 1} failed:`, error.message);
      }
    }
    */
    
    console.log('✅ Wallet detection trigger script ready');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Make at least 1 transfer from your wallet');
    console.log('   2. Wait a few minutes for wallet indexing');
    console.log('   3. Check your wallet - token should auto-appear');
    console.log('   4. Balance will show in main balance section');
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Transfer to another address you control');
    console.log('   - Or transfer to a friend/test address');
    console.log('   - Wallets detect tokens after first transfer');
    console.log('   - TronScan verification helps with auto-detection');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Make sure:');
    console.error('   - Contract address is correct');
    console.error('   - Private key is correct');
    console.error('   - Network is correct');
    console.error('   - Contract is deployed');
  }
}

// Run script
if (require.main === module) {
  triggerWalletDetection();
}

module.exports = { triggerWalletDetection };

