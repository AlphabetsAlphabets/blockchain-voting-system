// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Incrementer {
    uint256 public value;

    event ValueIncremented(uint256 newValue);

    constructor() {
        value = 0;
    }

    function increment() public {
        value += 1;
        emit ValueIncremented(value); // Emit event when value updates
    }
}
