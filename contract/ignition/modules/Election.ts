import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingSystemModule = buildModule("VotingSystemModule", (m) => {
    // Deploy the factory first
    const factory = m.contract("ElectionFactory", []);
    
    // If you want to create an initial election right away:
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 1 * 60 * 60;
    
    m.call(factory, "createElection", [
        "First Election",
        ["Proposal A", "Proposal B", "Proposal C"],
        ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"], // allowed voters
        now,
        now + oneDay
    ]);
    
    return { factory };
});

export default VotingSystemModule;