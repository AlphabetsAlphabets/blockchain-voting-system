// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Election.sol";

contract ElectionFactory {
    // Events
    event ElectionCreated(address electionAddress, string title, uint startTime, uint endTime);
    
    // State variables
    address public owner;
    address[] public elections;
    mapping(address => string) public electionTitles;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    // Create a new election
    function createElection(
        string memory title,
        string[] memory proposals,
        address[] memory allowedVoters,
        uint startTime, 
        uint endTime
    ) external onlyOwner returns (address) {
        // Deploy new election contract
        Election newElection = new Election(
            proposals,
            allowedVoters,
            startTime,
            endTime
        );
        
        // Store election address
        address electionAddress = address(newElection);
        elections.push(electionAddress);
        electionTitles[electionAddress] = title;
        
        // Transfer ownership to factory owner
        // This allows the owner to call admin functions on all elections
        newElection.transferOwnership(owner);
        
        // Emit event
        emit ElectionCreated(electionAddress, title, startTime, endTime);
        
        return electionAddress;
    }
    
    // Get all elections
    function getAllElections() external view returns (address[] memory) {
        return elections;
    }
    
    // Get election count
    function getElectionCount() external view returns (uint) {
        return elections.length;
    }
    
    // Get election details
    function getElectionDetails(uint index) external view returns (
        address electionAddress,
        string memory title,
        bool ended,
        uint startTime,
        uint endTime,
        address[] memory allowedVoters
    ) {
        require(index < elections.length, "Invalid election index");
        
        electionAddress = elections[index];
        title = electionTitles[electionAddress];
        
        Election election = Election(electionAddress);
        ended = election.ended();
        startTime = election.startTime();
        endTime = election.endTime();
        allowedVoters = election.getAllowedVoters();
    }
}