// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TRC20Token
 * @dev Implementation of the TRC20 Token Standard
 * 
 * ⚠️ EDUCATIONAL PURPOSE ONLY - NOT FOR COMMERCIAL USE ⚠️
 * 
 * DISCLAIMER:
 * - This token is created for educational and learning purposes only.
 * - This is NOT the official USDT token and should not be used as such.
 * - Do not use this token for real transactions or as a replacement for USDT.
 * - This token is NOT affiliated with Tether Limited or any official USDT issuer.
 * - Use of this token is at your own risk and for educational purposes only.
 * - The creators are not responsible for any misuse of this token.
 * 
 * SAFETY:
 * - This contract follows TRC20 standard for educational purposes.
 * - All functions are transparent and verifiable.
 * - No hidden or malicious code included.
 * - Source code is open for review and verification.
 */
contract TRC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    address public owner;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _decimals Token decimals (usually 18)
     * @param _initialSupply Initial token supply
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
        totalSupply = _initialSupply * 10**uint256(_decimals);
        _balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    /**
     * @dev Returns the balance of the specified address
     * @param account The address to query the balance of
     * @return The balance of the specified address (in smallest unit, e.g., 1000000 = 1.0 with 6 decimals)
     * 
     * NOTE: Wallets will automatically divide by (10 ** decimals) to display the actual balance.
     * Example: If this returns 1000000 and decimals is 6, wallet will show 1.0 USDT
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Transfer tokens to a specified address
     * @param to The address to transfer to
     * @param amount The amount to be transferred
     * @return success Whether the transfer was successful
     */
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param amount The amount to be transferred
     * @return success Whether the transfer was successful
     */
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    /**
     * @dev Approve the passed address to spend the specified amount of tokens
     * @param spender The address which will spend the funds
     * @param amount The amount of tokens to be spent
     * @return success Whether the approval was successful
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Approve to zero address");
        
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Returns the amount of tokens that an owner allowed to a spender
     * @param tokenOwner The address which owns the funds
     * @param spender The address which will spend the funds
     * @return The amount of tokens still available for the spender
     */
    function allowance(address tokenOwner, address spender) public view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }
    
    /**
     * @dev Burn tokens from the caller's account
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public {
        require(_balances[msg.sender] >= amount, "Insufficient balance to burn");
        
        _balances[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Mint to zero address");
        
        totalSupply += amount;
        _balances[to] += amount;
        
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}

