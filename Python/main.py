import json
import os
from dotenv import load_dotenv
from web3 import Web3

# Load environment variables
load_dotenv()
RPC_URL = "https://sepolia.infura.io/v3/0b68e7b7d2ca45a0a81e71919c78136c"
PRIVATE_KEY = "acd3e79d6b7568a2894c5259d619692edf7347668ac235c727830abeb7baa4ae"
CONTRACT_ADDRESS = "0xF44d73E73E12Bee90F071544AdAeac48cede157F"

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Ensure connection is successful
assert w3.is_connected(), "Failed to connect to Ethereum network!"

# Load contract ABI (from Hardhat artifacts)
with open("../artifacts/contracts/incrementor.sol/Incrementer.json") as f:
    contract_abi = json.load(f)["abi"]

# Get contract instance
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

# Get wallet address from private key
account = w3.eth.account.from_key(PRIVATE_KEY)
wallet_address = account.address

# Read current value
current_value = contract.functions.value().call()
print(f"Current Value: {current_value}")

# Send transaction to call `increment()`
tx = contract.functions.increment().build_transaction({
    "from": wallet_address,
    "gas": 100000,  # Adjust if needed
    "gasPrice": w3.eth.gas_price,
    "nonce": w3.eth.get_transaction_count(wallet_address),
})

# Sign and send the transaction
signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

print(f"Transaction sent! Hash: {tx_hash.hex()}")

# Wait for transaction receipt
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Transaction confirmed in block: {receipt.blockNumber}")

# Read updated value
updated_value = contract.functions.value().call()
print(f"Updated Value: {updated_value}")
