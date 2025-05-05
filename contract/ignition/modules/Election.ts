import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import dotenv from "dotenv";

const ElectionModule = buildModule("ElectionModule", (m) => {
    m.getParameter("owner", process.env.WALLET_ADDRESS);
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 60 * 60;
    const oneDay = 24 * oneHour;

    const startTime = now;
    const endTime = now + oneDay;

    const allowedVoters = [
        "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        "0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0", // marcel's address
        "0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e", // jia hong's address
    ]

    const items = ["Proposal A", "Proposal B", "Proposal C"];

    const election = m.contract("Election", [items, allowedVoters, startTime, endTime]);
    return { election };
});

export default ElectionModule;