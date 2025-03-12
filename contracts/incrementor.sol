// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Incrementer {
    uint256 public value;

    constructor() {
        value = 0;
    }

    function increment() public {
        value += 1;
    }
}
