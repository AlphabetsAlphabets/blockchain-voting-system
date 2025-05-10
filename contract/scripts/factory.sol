import "@openzeppelin/contracts/proxy/Clones.sol";

// this should be called by the frontend
contract ElectionFactory {
    address public implmentation;
    address[] public elections;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createElection(
        string[] memory items;
        address[] memory voters;
        uint start;
        uint end;
    ) external returns (address) {
        address clone = Clones.clone(implementation);
        Election(clone).initialize(items, voters, start, end);
        elections.push(clone);
        return clone;
    }

    function getElections() external view returns (address[] memory) {
        return elections;
    }
}