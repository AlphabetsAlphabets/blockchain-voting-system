# Setup

**Ensure that all commands from this point onwards are ran from within the `contract` folder.**

1. Install all dependencies

```
npm install
```

2. Create a .env file with the following contents

```
RPC_URL=https://sepolia-rpc.scroll.io/
PRIVATE_KEY=0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
CONTRACT_ADDRESS=
```

- `PRIVATE_KEY` is the value of private key #19 when you run `npx hardhat node` to start up a local blockchain.
- `CONTRACT_ADDRESS` is the address of the contract you wanna test for.

# Compiling and deploying smart contracts

After making a smart contract make sure to run:

```
npx hardhat compile
```

Then deploy it with

```
npx hardhat run scripts/<name_of_script> --network scrollSepolia
```

<name_of_script> is the name of the deployment script.

# Local testing

1. Start the local blockchain with

```
npx hardhat node
```

2. Open a new terminal and run

```
npx hardhat run ./scripts/testing/deploy.ts
```

The output will be as follows:

```
Deploying to network: hardhat
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000
Election deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Election starts at: 29/04/2025, 9:33:21 pm
Election ends at: 30/04/2025, 8:33:21 pm
Proposals: [ 'Proposal A', 'Proposal B', 'Proposal C' ]
Allowed voters: [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0',
  '0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e',
  '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
]
```

Make a note of `Election deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3` and put the address into `CONTRACT_ADDRESS` for the .env file.

3. Run the test script.

```
npx hardhat run scripts/testing/service_test.ts
```
