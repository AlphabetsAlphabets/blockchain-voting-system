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

    constructor(string[] items, Voter[] allowed_voters) {
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

        owner = msg.sender;
    }
}