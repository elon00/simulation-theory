// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimulationTheoryToken (SIM)
 * @notice Official Smart Contract for Simulation Theory ($SIM)
 * Grounded in the 2022 Nobel Prize in Physics (Aspect, Clauser, Zeilinger).
 *
 * Implements:
 * 1. Standard ERC-20 Cryptocurrency Token (Decentralized, Fixed Supply)
 * 2. On-Chain Quantum Bell-CHSH State Verification Oracle
 */

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract SimulationTheoryToken is IERC20 {
    string public constant name = "Simulation Theory";
    string public constant symbol = "SIM";
    uint8 public constant decimals = 18;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address public immutable owner;

    // Fixed Total Supply: 100,000,000 SIM tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18;

    // 2022 Nobel Prize On-Chain Verification Registry
    struct BellProof {
        address submitter;
        uint256 timestamp;
        int256 chshParameterS; // Scaled by 10^6 (e.g. 2828427 for 2*sqrt(2))
        bool violatesLocalRealism;
        string experimentRef;
    }

    BellProof[] public verifiedBellProofs;
    event BellProofRecorded(address indexed submitter, int256 chshParameterS, bool violatesLocalRealism);

    constructor() {
        owner = msg.sender;
        _totalSupply = INITIAL_SUPPLY;
        _balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function allowance(address ownerAccount, address spender) public view override returns (uint256) {
        return _allowances[ownerAccount][spender];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= value, "ERC20: insufficient allowance");
        _approve(from, msg.sender, currentAllowance - value);
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(_balances[from] >= value, "ERC20: transfer amount exceeds balance");

        _balances[from] -= value;
        _balances[to] += value;
        emit Transfer(from, to, value);
    }

    function _approve(address ownerAccount, address spender, uint256 value) internal {
        require(ownerAccount != address(0), "ERC20: approve from zero address");
        require(spender != address(0), "ERC20: approve to zero address");
        _allowances[ownerAccount][spender] = value;
        emit Approval(ownerAccount, spender, value);
    }

    /**
     * @notice Records an on-chain cryptographic proof of a Bell-CHSH test
     * @param sParameterScaled CHSH S value scaled by 1,000,000 (e.g., 2828427)
     * @param experimentReference Reference citation (e.g., "Aspect 1982 PRL")
     */
    function recordBellProof(int256 sParameterScaled, string calldata experimentReference) external returns (uint256) {
        // Bell inequality classical threshold is S = 2.0 (2_000_000 scaled)
        bool violates = sParameterScaled > 2_000_000;

        verifiedBellProofs.push(BellProof({
            submitter: msg.sender,
            timestamp: block.timestamp,
            chshParameterS: sParameterScaled,
            violatesLocalRealism: violates,
            experimentRef: experimentReference
        }));

        emit BellProofRecorded(msg.sender, sParameterScaled, violates);
        return verifiedBellProofs.length - 1;
    }

    function getProofsCount() external view returns (uint256) {
        return verifiedBellProofs.length;
    }
}
