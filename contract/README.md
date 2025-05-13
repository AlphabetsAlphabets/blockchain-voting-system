Respect the project structure.

1. `ignition/modules` - Write deployment code inside this folder.
2. `test` - Tests go here.
3. `contracts` - Contracts go here.

# Deploying

The purpose of deployment is to use it. It can be deployed to the test net or it can be deployed to the local blockchain the following is the difference:

1. When deploying to the local blockchain, no testnet ETH is required.
2. When deploying to the testnet, testnet ETH is required.

Choose local deployment during the initial phases. Choose testnet deployment when it is meant to be used by actual users. To start the local blockchain run this command:

```
npx hardhat node
```

To deploy locally run:

```
npx hardhat ignition deploy <path/to/script> --network localhost
```

To deploy to a specific network like the scroll sepolia testnet replace `localhost` with `scrollSepolia`.

This is some example output from local deployment.

1. From the terminal where you ran `ignition deploy`.

```
jiahongyap@star contract % npx hardhat ignition deploy ignition/modules/Election.ts --network localhost
Hardhat Ignition 🚀

Deploying [ ElectionModule ]

Batch #1
  Executed ElectionModule#Election

[ ElectionModule ] successfully deployed 🚀

Deployed Addresses

ElectionModule#Election - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

2. From the terminal where you started the local blockchain with `npx hardhat node`.

```
eth_chainId
hardhat_metadata
eth_accounts
hardhat_getAutomine
eth_chainId
eth_getBlockByNumber
eth_getTransactionCount (3)
eth_getBlockByNumber
eth_getTransactionCount
eth_getBlockByNumber
eth_chainId
eth_maxPriorityFeePerGas
eth_estimateGas
eth_call
  Contract deployment: Election
  Contract address:    0x5FbDB2315678afecb367f032d93F642f64180aa3
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

eth_sendTransaction
  Contract deployment: Election
  Contract address:    0x5FbDB2315678afecb367f032d93F642f64180aa3
  Transaction:         0xb5433970101443cf926c6a03c07f24e15dedc7deb722d13e34a32c8e9556fc2b
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1664197 of 1664197
  Block #1:            0xc51053e20c342f677b84fc400b337d44905a3ae2560804ad66b910555812d4bb

eth_getTransactionByHash
eth_getBlockByNumber
eth_getTransactionReceipt
```

# Testing

Testing is completely isolated. This means you do not need to have the local blockchain up when testing. To test simply run:

```
npx hardhat test
```

The library used for testing is called [Mocha](https://mochajs.org/). I managed to find [this](https://masteringjs.io/mocha) guide as well.
