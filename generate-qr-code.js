/**
 * Generate QR Code for Token Transfer
 * Creates QR code that can be scanned to send tokens directly
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS_HERE';
const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || 'USDT';
const NETWORK = process.env.NETWORK || 'mainnet';

/**
 * Generate QR Code for Token Transfer
 * Format: tronlink://send?token=CONTRACT_ADDRESS&amount=AMOUNT&to=ADDRESS
 */
async function generateQRCode(options = {}) {
  try {
    const {
      toAddress = null,
      amount = null,
      recipientName = '',
      outputPath = './qr-codes'
    } = options;

    // Create output directory
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // QR Code Data Format for TronLink
    // Format 1: Direct transfer with amount
    // Format 2: Just contract address for receiving
    // Format 3: Full transfer URL

    let qrData;
    let fileName;
    let description;

    if (toAddress && amount) {
      // QR Code for sending specific amount
      qrData = `tronlink://send?token=${CONTRACT_ADDRESS}&amount=${amount}&to=${toAddress}`;
      fileName = `send-${TOKEN_SYMBOL}-${amount}-to-${toAddress.slice(-8)}.png`;
      description = `Send ${amount} ${TOKEN_SYMBOL} to ${toAddress}`;
    } else if (toAddress) {
      // QR Code for receiving (just address)
      qrData = toAddress;
      fileName = `receive-${TOKEN_SYMBOL}-${toAddress.slice(-8)}.png`;
      description = `Receive ${TOKEN_SYMBOL} at ${toAddress}`;
    } else {
      // QR Code for contract address (for adding token)
      qrData = CONTRACT_ADDRESS;
      fileName = `contract-${TOKEN_SYMBOL}.png`;
      description = `${TOKEN_SYMBOL} Token Contract Address`;
    }

    // Generate QR Code
    const filePath = path.join(outputPath, fileName);
    
    await QRCode.toFile(filePath, qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log('✅ QR Code Generated Successfully!');
    console.log('');
    console.log('📋 Details:');
    console.log('   Description:', description);
    console.log('   File:', filePath);
    console.log('   QR Data:', qrData);
    console.log('');
    console.log('📱 Usage:');
    if (toAddress && amount) {
      console.log('   1. Open TronLink wallet');
      console.log('   2. Scan this QR code');
      console.log('   3. Confirm transfer');
      console.log('   4. Tokens will be sent automatically');
    } else if (toAddress) {
      console.log('   1. Share this QR code');
      console.log('   2. Others can scan to send tokens');
      console.log('   3. No import link needed!');
    } else {
      console.log('   1. Scan to add token to wallet');
      console.log('   2. Or share for others to add');
    }

    return {
      filePath,
      qrData,
      description
    };

  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
    throw error;
  }
}

/**
 * Generate multiple QR codes
 */
async function generateMultipleQRCodes() {
  console.log('🎨 Generating QR Codes for Token...\n');
  console.log('📝 Contract Address:', CONTRACT_ADDRESS);
  console.log('🪙 Token Symbol:', TOKEN_SYMBOL);
  console.log('🌐 Network:', NETWORK);
  console.log('');

  const qrCodes = [];

  // 1. Contract address QR code (for adding token)
  console.log('1️⃣ Generating Contract Address QR Code...');
  const contractQR = await generateQRCode({});
  qrCodes.push(contractQR);
  console.log('');

  // 2. Example: Generate QR for receiving (you can customize)
  // Uncomment and modify as needed
  /*
  console.log('2️⃣ Generating Receive Address QR Code...');
  const receiveAddress = 'YOUR_RECEIVE_ADDRESS_HERE';
  const receiveQR = await generateQRCode({
    toAddress: receiveAddress
  });
  qrCodes.push(receiveQR);
  console.log('');

  // 3. Example: Generate QR for sending specific amount
  console.log('3️⃣ Generating Send QR Code...');
  const sendQR = await generateQRCode({
    toAddress: receiveAddress,
    amount: '100' // Amount in tokens (will be converted by wallet)
  });
  qrCodes.push(sendQR);
  console.log('');
  */

  console.log('✅ All QR Codes Generated!');
  console.log('');
  console.log('📁 Location: ./qr-codes/');
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Share QR codes directly');
  console.log('   - No import links needed');
  console.log('   - Scan with TronLink wallet');
  console.log('   - Works for sending and receiving');

  return qrCodes;
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'send' && args[1] && args[2]) {
    // Generate send QR: node generate-qr-code.js send ADDRESS AMOUNT
    generateQRCode({
      toAddress: args[1],
      amount: args[2]
    });
  } else if (args[0] === 'receive' && args[1]) {
    // Generate receive QR: node generate-qr-code.js receive ADDRESS
    generateQRCode({
      toAddress: args[1]
    });
  } else {
    // Generate all QR codes
    generateMultipleQRCodes();
  }
}

module.exports = { generateQRCode, generateMultipleQRCodes };

