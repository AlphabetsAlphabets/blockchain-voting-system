// https://spdx.org/licenses/ , not important but should be considered in documentation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

struct Proposal {
    string name;
    uint votes;
}

contract Election {
    address public owner;
    bool public ended;

    mapping(string => Proposal) public proposals;
    mapping(address => bool) public voterRegistry;  // for tracking who can vote
    mapping(address => bool) public hasVoted;       // for tracking who has voted

    uint public startTime;
    uint public endTime;
    string[] public proposalNames; // to track names of proposals (redundant?)

    // modifiers are used to change the behaviours of functions in a declarative way
    // allows us to add preconditions, postconditions, or other logic that must be executed before or after a function call
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyDuringVotingPeriod() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Not during voting period");
        require(!ended, "Election has ended");
        _;
    }

    constructor(string[] memory items, address[] memory allowedVoters, uint _startTime, uint _endTime) {
        require(_startTime < _endTime, "Start time must be before end time");
        require(items.length > 0, "At least one proposal required"); // set minimum proposals here

        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;

        for (uint256 i = 0; i < items.length; i++) {
            proposals[items[i]] = Proposal({
                name: items[i],
                votes: 0
            });
            proposalNames.push(items[i]);
        }

        for (uint i = 0; i < allowedVoters.length; i++) {
            voterRegistry[allowedVoters[i]] = true;
        }
    }

    // actual use-case functions below

    // note, "external" means it can only be called from outside the contract
    // this is good practice if you want to add additional functions

    // "msg.sender" refers to the address of the account that called the function
    // NEVER USE "tx.origin" FOR AUTH OPERATIONS, IT IS VULNERABLE TO PHISHING ATTACKS
    
    // function to cast a vote
    function vote(string memory proposal) external onlyDuringVotingPeriod returns(uint status) {
        
        // I got rid of the voter struct as verification can be done inside the vote function itself
        // implemented a voter registry system against the current double voting issue for now, this needs revision later

        require(voterRegistry[msg.sender], "Not registered to vote");
        require(!hasVoted[msg.sender], "Already voted");
        require(bytes(proposals[proposal].name).length != 0, "Invalid proposal");

        proposals[proposal].votes += 1;
        hasVoted[msg.sender] = true;

        return 0; // success
    }

    function endVote() external onlyOwner {
        require(block.timestamp > endTime || !ended, "Election already ended or not finished");
        ended = true;
    }

    function getProposalVotes(string memory proposal) public view returns (uint) {
        return proposals[proposal].votes;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalNames.length);
        for (uint i = 0; i < proposalNames.length; i++) {
            allProposals[i] = proposals[proposalNames[i]];
        }
        return allProposals;
    }

    function checkElectionStatus() public view returns (string memory) {
        if (ended) return "Election ended";
        if (block.timestamp < startTime) return "Election not started";
        if (block.timestamp > endTime) return "Voting period over (ready to end)";
        return "Voting in progress";
    }
}