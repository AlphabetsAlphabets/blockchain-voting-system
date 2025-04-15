11/04/2025
Here's a breakdown of all current files and their purposes:

**Smart Contract Files**
`contracts/Increment.sol` and `contracts/Lock.sol` are both Sol files that contain smart contract definitions. From my understanding, both are code samples:
- `Increment.sol` defines a simple counter contract
- `Lock.sol` defines a contract for locking funds until a specific time

`artifacts` can be ignored, it just contains compiled contract artifacts such as bytecode and metadata.

`ignition/modules/Lock.ts` is what I believe is the main code right now
- it is a deployment script for the Lock using HardHat Ignition.

**Test Files**
`test/Lock.ts` contains unit tests for the Lock contract using HardHat and Chai.

**Web3 Integration Files**
`site/app/web3_utils.py` is a python utility file for interacting with the deployed smart contracts using Web3.py.
- right now it loads the contract ABI and connects to the Eth network

check `requirements.txt` for a list of python dependencies for Flask and Web3

**config**
`package.json` defines project dependencies and scripts