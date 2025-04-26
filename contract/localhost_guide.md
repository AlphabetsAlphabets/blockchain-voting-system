## Local Deployment and Testing Guide for Election Contract
### Setup
Make sure ur environment variables are setup properly inside ur `.env` file:
```
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia-rpc.scroll.io
```

### Local Testing
To create a local blockchain with 20 pre-funded accounts, run
```
npx hardhat node
```

Then, in a new terminal, run
```
npx hardhat run .\scripts\testing\deploy.ts
``` 
This will:
- Deploy your Election contract to the local blockchain
- Create a deployment.json file with the contract address