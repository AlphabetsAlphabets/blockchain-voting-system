// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";

// minimal interface for the initialize() function
interface IElection {
    function initialize(
        string[] memory items,
        address[] memory voters,
        uint start,
        uint end
    ) external;
}

contract ElectionFactory {
    address public implementation;
    address[] public elections;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createElection(
        string[] memory items,
        address[] memory voters,
        uint start,
        uint end
    ) external returns (address) {
        address clone = Clones.clone(implementation);
        IElection(clone).initialize(items, voters, start, end);
        elections.push(clone);
        return clone;
    }

    function getElections() external view returns (address[] memory) {
        return elections;
    }
}
