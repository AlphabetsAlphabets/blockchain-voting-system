# Setup

To develop smart contracts make sure to run

```
npm install
```

In order to download the required dependencies. Make sure this command is ran inside the `contract` folder.

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
