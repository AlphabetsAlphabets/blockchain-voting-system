pragma solidity ^0.8.19

struct Proposal {
    bytes32 name;
    uint agree_votes;
    uint disagree_votes;
}

struct Voter {
    address wallet;
    bool voted;
}

contract Election {
    address public owner;
    Proposal[] public proposals;
    mapping(address => bool) voters; 
    uint start_date;
    uint end_date;   

    constructor(string[] items, Voter[] allowed_voters, string start, string end) {
        for (uint256 i = 0; i < items.length; i++) {
            proposals.push(Proposal {
                name: items[i],
                agree_votes: 0,
                disagree_votes: 0,
            });
        }

        for (uint i = 0; i < allowed_voters.length; i++) {
            voters[allowed_voters[i]] = false;
        }

        // Will need to convert start and end into a unix time stamp
        // then save it to start_date and end_date.
        owner = msg.sender;
    }
}