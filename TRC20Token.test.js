const TRC20Token = artifacts.require('TRC20Token');

contract('TRC20Token', (accounts) => {
  let token;
  const owner = accounts[0];
  const recipient = accounts[1];
  const spender = accounts[2];
  
  const tokenName = 'Test Token';
  const tokenSymbol = 'TEST';
  const tokenDecimals = 18;
  const initialSupply = 1000000;

  beforeEach(async () => {
    token = await TRC20Token.new(
      tokenName,
      tokenSymbol,
      tokenDecimals,
      initialSupply
    );
  });

  describe('Deployment', () => {
    it('should set the correct token name', async () => {
      assert.equal(await token.name(), tokenName);
    });

    it('should set the correct token symbol', async () => {
      assert.equal(await token.symbol(), tokenSymbol);
    });

    it('should set the correct decimals', async () => {
      assert.equal(await token.decimals(), tokenDecimals);
    });

    it('should set the correct total supply', async () => {
      const expectedSupply = initialSupply * 10**tokenDecimals;
      assert.equal((await token.totalSupply()).toString(), expectedSupply.toString());
    });

    it('should assign all tokens to owner', async () => {
      const ownerBalance = await token.balanceOf(owner);
      const totalSupply = await token.totalSupply();
      assert.equal(ownerBalance.toString(), totalSupply.toString());
    });
  });

  describe('Transfers', () => {
    const transferAmount = 1000 * 10**tokenDecimals;

    it('should transfer tokens correctly', async () => {
      await token.transfer(recipient, transferAmount, { from: owner });
      const recipientBalance = await token.balanceOf(recipient);
      assert.equal(recipientBalance.toString(), transferAmount.toString());
    });

    it('should fail if insufficient balance', async () => {
      try {
        await token.transfer(recipient, transferAmount, { from: recipient });
        assert.fail('Should have thrown');
      } catch (error) {
        assert(error.message.includes('Insufficient balance'));
      }
    });

    it('should fail if transferring to zero address', async () => {
      try {
        await token.transfer('0x0000000000000000000000000000000000000000', transferAmount, { from: owner });
        assert.fail('Should have thrown');
      } catch (error) {
        assert(error.message.includes('zero address'));
      }
    });
  });

  describe('Approvals', () => {
    const approveAmount = 500 * 10**tokenDecimals;

    it('should approve tokens correctly', async () => {
      await token.approve(spender, approveAmount, { from: owner });
      const allowance = await token.allowance(owner, spender);
      assert.equal(allowance.toString(), approveAmount.toString());
    });

    it('should allow transferFrom after approval', async () => {
      await token.approve(spender, approveAmount, { from: owner });
      await token.transferFrom(owner, recipient, approveAmount, { from: spender });
      const recipientBalance = await token.balanceOf(recipient);
      assert.equal(recipientBalance.toString(), approveAmount.toString());
    });
  });

  describe('Burn', () => {
    const burnAmount = 100 * 10**tokenDecimals;

    it('should burn tokens correctly', async () => {
      const initialBalance = await token.balanceOf(owner);
      const initialSupply = await token.totalSupply();
      
      await token.burn(burnAmount, { from: owner });
      
      const finalBalance = await token.balanceOf(owner);
      const finalSupply = await token.totalSupply();
      
      assert.equal(
        finalBalance.toString(),
        (initialBalance - burnAmount).toString()
      );
      assert.equal(
        finalSupply.toString(),
        (initialSupply - burnAmount).toString()
      );
    });
  });

  describe('Mint', () => {
    const mintAmount = 1000 * 10**tokenDecimals;

    it('should mint tokens correctly (owner only)', async () => {
      const initialSupply = await token.totalSupply();
      await token.mint(recipient, mintAmount, { from: owner });
      
      const finalSupply = await token.totalSupply();
      const recipientBalance = await token.balanceOf(recipient);
      
      assert.equal(
        finalSupply.toString(),
        (initialSupply + mintAmount).toString()
      );
      assert.equal(recipientBalance.toString(), mintAmount.toString());
    });

    it('should fail if non-owner tries to mint', async () => {
      try {
        await token.mint(recipient, mintAmount, { from: recipient });
        assert.fail('Should have thrown');
      } catch (error) {
        assert(error.message.includes('Only owner'));
      }
    });
  });
});

