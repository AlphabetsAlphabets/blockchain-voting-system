import json
from web3 import Web3
from web3 import contract
from config import Config

class ContractHelper:
    __w3 = None
    __compiled_contracts_directory = "contract/artifacts/contracts"

    def __init__(self):
        print(Config.RPC_URL)
        w3 = Web3(Web3.HTTPProvider(Config.RPC_URL))

        # TODO: Throw an error here.
        if not w3.is_connected():
            self.__w3 = None
            return None
        
        self.__w3 = w3

    # Returns a contract object
    def get_abi(self, contract) -> contract.Contract:
        abi = f"{self.__compiled_contracts_directory}/{contract}.sol/{contract}.json"
        with open(abi) as f:
            contract_abi = json.load(f)["abi"]

        eth = self.__w3
        # Contract instance
        contract = eth.contract(address=Config.CONTRACT_ADDRESS, abi=contract_abi)
        return contract
    
    

def view_election_details():

    return