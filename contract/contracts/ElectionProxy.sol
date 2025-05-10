// https://spdx.org/licenses/ , not important but should be considered in documentation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Election.sol";

import "@openzeppelin/contracts/proxy/transparent";

contract ElectionProxy {
    address public implementation;
    address public proxy;

    constructor(address _implementation) {
        implementation = _implementation;
        TransparentUpgradeableProxy proxyInstance = new TransparentUpgradeableProxy(_implementation);
        proxy = address(proxyInstance);
    }
}