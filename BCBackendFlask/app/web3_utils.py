import json
from web3 import Web3
from config import Config

# Connect to Ethereum
w3 = Web3(Web3.HTTPProvider(Config.RPC_URL))
assert w3.is_connected(), "Failed to connect to Ethereum!"

# Load contract ABI
with open("BCContract/artifacts/contracts/Increment.sol/Incrementer.json") as f:
    contract_abi = json.load(f)["abi"]

# Contract instance
contract = w3.eth.contract(address=Config.CONTRACT_ADDRESS, abi=contract_abi)

# Get account
account = w3.eth.account.from_key(Config.PRIVATE_KEY)
wallet_address = account.address

def get_contract_value():
    """Fetches the current value from the smart contract."""
    return contract.functions.value().call()

def increment_contract_value():
    """Sends a transaction to increment the value in the smart contract."""
    tx = contract.functions.increment().build_transaction({
        "from": wallet_address,
        "gas": 100000,
        "gasPrice": w3.eth.gas_price,
        "nonce": w3.eth.get_transaction_count(wallet_address),
    })
    signed_tx = w3.eth.account.sign_transaction(tx, Config.PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return tx_hash.hex()
