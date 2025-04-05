from flask import Blueprint, jsonify
from app.web3_utils import get_contract_value, increment_contract_value

main = Blueprint("main", __name__)

@main.route("/get_value", methods=["GET"])
def get_value():
    """API endpoint to fetch the smart contract value."""
    try:
        value = get_contract_value()
        return jsonify({"value": value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/increment", methods=["POST"])
def increment():
    """API endpoint to increment the contract value."""
    try:
        tx_hash = increment_contract_value()
        return jsonify({"message": "Transaction successful!", "tx_hash": tx_hash})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
