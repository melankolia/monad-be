// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MemoryGame {
    uint256 private _count;

    event CounterIncremented(uint256 newCount);

    constructor() {
        _count = 0;
    }

    function increment() public returns (uint256) {
        _count += 1;
        emit CounterIncremented(_count);
        return _count;
    }

    function getCount() public view returns (uint256) {
        return _count;
    }
}
