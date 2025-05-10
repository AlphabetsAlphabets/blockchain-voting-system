// https://spdx.org/licenses/ , not important but should be considered in documentation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

struct Proposal {
    string name;
    uint votes;
}

// This is the implementation. 
// Will need to figure out how to
// actually make it from the proxy.
contract Election is Initializable {
    // Do not set any values here. Do it in the initalise function.
    // Unless the value is a constant.
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

    /// @notice initializes the election with proposals and allowed voters
    function initialize(
        string[] memory items,
        address[] memory allowedVoters,
        uint _startTime,
        uint _endTime
    ) public initializer {
        require(_startTime < _endTime, "Start time must be before end time");
        require(items.length > 0, "At least one proposal required"); // set minimum proposals here

        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
        ended = false;

        // totalProposals = 0;
        // totalVoters = 0;

        // register proposals
        for (uint i = 0; i < items.length; i++) {
            proposals[items[i]] = Proposal({name: items[i], votes: 0});
            proposalNames.push(items[i]);
        }
        totalProposals = items.length;

        // register voters
        for (uint i = 0; i < allowedVoters.length; i++) {
            voterRegistry[allowedVoters[i]] = true;
            voterAddresses.push(allowedVoters[i]);
        }
        totalVoters = allowedVoters.length;

        // // TODO: Move this off chain
        // for (uint256 i = 0; i < items.length; i++) {
        //     proposals[items[i]] = Proposal({name: items[i], votes: 0});
        //     proposalNames.push(items[i]);
        //     totalProposals += 1;
        // }

        // voterAddresses = allowedVoters;
        // for (uint i = 0; i < allowedVoters.length; i++) {
        //     voterRegistry[allowedVoters[i]] = true;
        //     totalVoters += 1;
        // }
    }

    /// @notice checks if a given proposal exists
    function proposalExists(string memory proposal) internal view returns (bool) {
        return bytes(proposals[proposal].name).length != 0;
    }

    /// @return 0 if OK, 1 = not registered, 2 = already voted, 3 = invalid proposal
    function canVote(string memory proposal) public view onlyDuringVotingPeriod returns (uint) {
        if (!voterRegistry[msg.sender]) return 1;
        if (hasVoted[msg.sender]) return 2;
        if (!proposalExists(proposal)) return 3;
        return 0;
    }

    function vote(string memory proposal) external onlyDuringVotingPeriod {
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

    // getters (view functions)
    function getProposalVotes(string memory proposal) public view returns (uint) {
        return proposals[proposal].votes;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory all = new Proposal[](totalProposals);
        for (uint i = 0; i < totalProposals; i++) {
            all[i] = proposals[proposalNames[i]];
        }
        return all;
    }

    function getAllowedVoters() public view returns (address[] memory) {
        return voterAddresses;
    }

    function getProposalNames() public view returns (string[] memory) {
        return proposalNames;
    }

    function hasAddressVoted(address addr) public view returns (bool) {
        return hasVoted[addr];
    }

    function isRegisteredVoter(address addr) public view returns (bool) {
        return voterRegistry[addr];
    }
}