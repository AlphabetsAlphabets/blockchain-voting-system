pragma solidity ^0.8.19

struct Proposal {
    bytes32 name;
    uint votes;
}

struct Voter {
    address wallet;
    bool voted;
}

contract Election {
    address public owner;
    bool public ended;

    // string is the name of the thing to vote for.
    mapping(string => Proposal) proposals;
    mapping(address => bool) voters; 

    uint start_date;
    uint end_date;   

    constructor(string[] items, Voter[] allowed_voters, string start, string end) {
        for (uint256 i = 0; i < items.length; i++) {
            proposals[items[i]] = Proposal {
                name: items[i],
                votes: 0,
            }
        }

        for (uint i = 0; i < allowed_voters.length; i++) {
            voters[allowed_voters[i]] = false;
        }

        // Will need to convert start and end into a unix time stamp
        // then save it to start_date and end_date.
        owner = msg.sender;
    }

    // 0 = ok, 1 = failure, 2 = election ended
    function vote(address person, string proposal) public returns (uint status) {
        if (ended) {
            return 2;
        }

        Voter voter = voters[person];
        if (voter.voted) {
            return 1;
        }

        proposals[proposal].votes += 1;
        return 0;
    }
}