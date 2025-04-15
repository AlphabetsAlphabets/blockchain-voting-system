# Setup

**Ensure that all commands from this point onwards are ran from within the `contract` folder.**

1. Install all dependencies

```
npm install
```

2. Create a .env file with the following contents

```
RPC_URL=https://sepolia.infura.io/v3/0b68e7b7d2ca45a0a81e71919c78136c
BACKUP=https://sepolia.infura.io/v3/0b68e7b7d2ca45a0a81e71919c78136c
PRIVATE_KEY=
CONTRACT_ADDRESS=
```

Make sure to fill in `PRIVATE_KEY` with the private key of your wallet.

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
