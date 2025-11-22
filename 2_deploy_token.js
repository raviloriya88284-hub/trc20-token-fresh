const TRC20Token = artifacts.require('TRC20Token');

module.exports = async function(deployer, network, accounts) {
  // ⚠️ EDUCATIONAL PURPOSE ONLY ⚠️
  // Token configuration for educational USDT-style token
  const tokenName = 'USDT';
  const tokenSymbol = 'USDT';
  const tokenDecimals = 6; // USDT uses 6 decimals
  const initialSupply = 1000000; // 1 million tokens (for education)
  
  console.log('Deploying TRC20 Token...');
  console.log('Token Name:', tokenName);
  console.log('Token Symbol:', tokenSymbol);
  console.log('Decimals:', tokenDecimals);
  console.log('Initial Supply:', initialSupply);
  console.log('Deployer Address:', accounts[0]);
  
  await deployer.deploy(
    TRC20Token,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    initialSupply
  );
  
  const tokenInstance = await TRC20Token.deployed();
  console.log('Token deployed at:', tokenInstance.address);
  console.log('Total Supply:', (await tokenInstance.totalSupply()).toString());
};

