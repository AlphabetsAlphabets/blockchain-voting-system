# Authors
This assignment is done by Tamim Hozza, Abudrahman, Marcel Ares Putra and Yap Jia Hong.

# Blockchain voting system
The repository has a monorepo structure. This means that the frontend is in the `frontend` folder and the code for the smart contract is in `contracts`. Therefore, you must run `npm` or `npx` commands in their respective folders. The deployment section in this README is for running the application. For more detailed developer instructions, make sure to refer to the `README.md` in the respective folders.

# Deployment
You must first compile the smart contracts before you run the website.

## Smart contract deployment
**All commands from this point on must be in `contract` folder.**

```
npm install
npx hardhat node
npx hardhat compile
npx hardhat ignition deploy ignition/modules/Election.sol --network localhost
```

## Frontend deployment
**All commands from this point on must be in the `frontend` folder.**

```
npm install
npm start
```