// https://spdx.org/licenses/ , not important but should be considered in documentation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Proposal {
    string name;
    uint votes;
}

contract Election {
    event VoteStatus(string result);

    address public owner;
    bool public ended;

    mapping(string => Proposal) public proposals;
    // This isn't redundant because the mapping proposals at the top cannot be looped through.
    // Most solutions online use a separate variable to keep track of the key. In this case
    // the proposal names.
    string[] public proposalNames;
    uint totalProposals;

    mapping(address => bool) public voterRegistry; // for tracking who can vote
    address[] voterAddresses;
    uint totalVoters;

    mapping(address => bool) public hasVoted; // for tracking who has voted

    uint public startTime;
    uint public endTime;

    // modifiers are used to change the behaviours of functions in a declarative way
    // allows us to add preconditions, postconditions, or other logic that must be executed before or after a function call
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyDuringVotingPeriod() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Not during voting period"
        );
        require(!ended, "Election has ended");
        _;
    }

    constructor(
        string[] memory items,
        address[] memory allowedVoters,
        uint _startTime,
        uint _endTime
    ) {
        require(_startTime < _endTime, "Start time must be before end time");
        require(items.length > 0, "At least one proposal required"); // set minimum proposals here

        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;

        totalProposals = 0;

        for (uint256 i = 0; i < items.length; i++) {
            proposals[items[i]] = Proposal({name: items[i], votes: 0});
            proposalNames.push(items[i]);
            totalProposals += 1;
        }

        voterAddresses = allowedVoters;
        for (uint i = 0; i < allowedVoters.length; i++) {
            voterRegistry[allowedVoters[i]] = true;
            totalVoters += 1;
        }
    }

    // 1 - Not registered to vote
    // 2 - Already voted.
    // 3 - Invalid proposal
    function canVote(
        string memory proposal
    ) public view onlyDuringVotingPeriod returns (uint status) {
        if (!voterRegistry[msg.sender]) {
            return 1;
        }

        if (hasVoted[msg.sender]) {
            return 2;
        }

        Proposal memory chosen = proposals[proposal];
        if (bytes(chosen.name).length == 0 && chosen.votes == 0) {
            return 3;
        }

        return 0;
    }

    function vote(
        string memory proposal
    ) external onlyDuringVotingPeriod {
        uint status = canVote(proposal);
        require(status == 0, "Unable to vote.");

        proposals[proposal].votes += 1;
        hasVoted[msg.sender] = true;
    }


    function endVote() external onlyOwner {
        require(
            block.timestamp > endTime || !ended,
            "Election already ended or not finished"
        );
        ended = true;
    }

    function getProposalVotes(
        string memory proposal
    ) public view returns (uint) {
        return proposals[proposal].votes;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](totalProposals);
        for (uint i = 0; i < totalProposals; i++) {
            Proposal memory proposal = proposals[proposalNames[i]];
            allProposals[i] = proposal;
        }

        return allProposals;
    }

    function getAllowedVoters() public view returns (address[] memory) {
        address[] memory voters = new address[](totalVoters);
        for (uint i = 0; i < totalVoters; i++) {
            voters[i] = voterAddresses[i];
        }

        return voters;
    }

    // change to bools
    function checkElectionStatus() public view returns (bool) {
        // True if ended, false
        return ended;
    }
}
