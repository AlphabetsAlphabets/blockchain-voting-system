# Authors
This assignment is done by Yap Jia Hong (TP063375), Tamim Mustapha Hozza (TP072531), Marcelino Ares Pratama Putra (TP066419) and Abdurrahman Murtala Modibbo (TP071895)

# Blockchain voting system
**NEVER RUN NPM INSTALL IN THE ROOT OF THE PROJECT ONLY IN THE SUB FOLDERS.**


The repository has a monorepo structure. This means that the frontend is in the `frontend` folder and the code for the smart contract is in `contracts`. Therefore, you must run `npm` or `npx` commands in their respective folders. The deployment section in this README is for running the application. For more detailed developer instructions, make sure to refer to the `README.md` in the respective folders.

# Deployment
You must first compile the smart contracts and then setup a wallet before running the website.

## Smart contract deployment
**All commands from this point on must be in `contract` folder.**

Create two terminals and do not close them. The first will run:
```
npm install
npx hardhat compile
npx hardhat node
```

The second will run:
```
npm run deploy
```

## Wallet setup
1. Go to the Metamask extension, click on the three dots on the top right then expand view.
2. Add a custom network by clicking the dropdown list on the top left and then "Add custom network".
3. Fill in the relavant fields. Network name can be anything such as "CUSTOM"
4. Enter a network name, can be anything.
5. Default RPC URL -> Add RPC URL and fill in `http://127.0.0.1:8545/` for RPC URL.
6. Set the chain id as `31337`.

Now we need to import a wallet.
1. Click on the top left and swap to the "CUSTOM" network.
2. Click at the centre there should be text "Account 1" for example and then import wallet.
3. On the terminal where `npx hardhat node` is ran, copy a private key and import.key and import that wallet.

## Frontend deployment
**All commands from this point on must be in the `frontend` folder.**

In the terminal where `npm run deploy` was ran, there should be a contract address in this case it is `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

```
jiahongyap@star contract % npm run deploy

> bccontract@1.0.0 deploy
> npx hardhat ignition deploy ./ignition/modules/Election.ts --reset --network localhost

Hardhat Ignition 🚀

Deploying [ VotingSystemModule ]

Batch #1
  Executed VotingSystemModule#ElectionFactory

Batch #2
  Executed VotingSystemModule#ElectionFactory.createElection

[ VotingSystemModule ] successfully deployed 🚀

Deployed Addresses

VotingSystemModule#ElectionFactory - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Navigate to `frontend/src/app/Election/page.tsx` and `frontend/src/app/votingPage/page.tsx` locate the `FACTORY_ADDRESS` variable. Replace the value of that variable with the contract address. Then you can run:

```
npm install
npm start
```