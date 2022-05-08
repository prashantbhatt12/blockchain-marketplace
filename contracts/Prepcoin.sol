// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PrepCoin is ERC20 {
    address public owner;

    //Premint the owner 10000 PRC
    constructor() ERC20("PrepCoin", "PRC") {
        owner = msg.sender;
        _mint(owner, 10000 * 10**decimals());
    }

    //Function to reward user
    function giveRewards(address payable addr, uint256 reward) public {
        _mint(addr, reward * 10**decimals());
    }

    //Function to airdrop PrepCoins
    function airdrop(address payable addr) public {
        _mint(addr, 100 * 10**decimals());
    }
}
