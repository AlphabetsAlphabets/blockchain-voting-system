from flask import Blueprint, jsonify
from ..run import contract_helper

main = Blueprint("main", __name__)

@main.route("/get_value", methods=["GET"])
def get_value():
    """API endpoint to fetch the smart contract value."""
    contract = contract_helper.get_abi("Incrementor")

    try:
        value = contract.functions.value().call()
        return jsonify({"value": value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/increment", methods=["POST"])
def increment():
    """API endpoint to increment the contract value."""
    contract = contract_helper.get_abi("Incrementor")
    try:
        contract.functions.increment().build_transaction({
            "from": wallet_address,
            "gas": 100000,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(wallet_address),
        })

        signed_tx = w3.eth.account.sign_transaction(tx, Config.PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_hash = tx_hash.hex()

        return jsonify({"message": "Transaction successful!", "tx_hash": tx_hash})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/view_election", methods=["GET"])
def view_election():
    
    return

@main.route("/")
def index():
    msg = "Go to /view_election"
    return msg
