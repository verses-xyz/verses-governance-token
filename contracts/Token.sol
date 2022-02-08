//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    event Paused(address account);
    event Unpaused(address account);

    address public owner;
    uint private immutable _cap;
    bool private _paused;

    constructor(uint maxHolders) ERC20("Verses", "VERSES") {
        require(maxHolders > 1, "max holders must be greater than 1");
        owner = msg.sender;
        _paused = false;
        _cap = maxHolders * 1_000_000_000_000_000_000;
        _mint(_msgSender(), 1_000_000_000_000_000_000);
    }

    function cap() public view virtual returns (uint) {
        return _cap;
    }

    function mint(address account, uint amount) public {
        require(msg.sender == owner, "only owner can mint");
        require(amount % 1_000_000_000_000_000_000 == 0, "can only mint full tokens");
        require(ERC20.totalSupply() + amount <= cap(), "cannot mint beyond cap");
        _mint(account, amount);
    }

    function pause() public {
        require(msg.sender == owner, "only owner can pause");
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public {
        require(msg.sender == owner, "only owner can unpause");
        _paused = false;
        emit Unpaused(msg.sender);
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    function _beforeTokenTransfer(
	address from,
        address to,
        uint256 amount
    ) internal override view {
        require(!paused(), "transfers paused");
        require(amount % 1_000_000_000_000_000_000 == 0, "can only transfer full tokens");
    }
}
