from app import create_app
from contract_helper import ContractHelper

contract_helper = None

# Run the app
if __name__ == "__main__":
    # Setup connection to blockchain
    contract_helper = ContractHelper()

    # Initialize Flask app
    app = create_app()
    app.run(debug=True)
