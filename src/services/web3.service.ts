import * as W3 from "web3";
const Web3 = require("web3");

export default class Web3Service {

    public web3: W3.default;
    public tokenContract: any;

    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        
        let address = "0x88d2A7EBe58d574f107be485306F776673Eea459";

        let abi = `[
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getOfferPrice",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x108195f5"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getCommitedFromRented",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x4e5e63b5"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getStatus",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x4e69d560"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getOfferLeasedTimestamp",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x950e6beb"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getOfferLeasedTo",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x9a0907ba"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getRentedFrom",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x9c929348"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getCommitedFromBalance",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x9f686d9f"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getRentedAvailableTokens",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xa4928973"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getOfferNumberOfTokens",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xaba1883a"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getRentedNumberOfTokens",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xb6a93382"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "getOfferDuration",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xc2a1f5c9"
          },
          {
            "inputs": [
              {
                "name": "totalSupply",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor",
            "signature": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "Approval",
            "type": "event",
            "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "Transfer",
            "type": "event",
            "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              }
            ],
            "name": "OwnershipTransfered",
            "type": "event",
            "signature": "0x0d18b5fd22306e373229b9439188228edca81207d1667f604daf6cef8aa3ee67"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "numberOfTokens",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "price",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "duration",
                "type": "uint256"
              }
            ],
            "name": "OfferCreated",
            "type": "event",
            "signature": "0x90a9eceab52715252ab1d154d77c32c3a27117d68723b35afd71c3e528eb70d3"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              }
            ],
            "name": "OfferRemoved",
            "type": "event",
            "signature": "0xdf23490ffb4f2c066b5d9f245079c179b5af5ecffbec540ffe2fa69604f01aa5"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              }
            ],
            "name": "Leased",
            "type": "event",
            "signature": "0x1ec5d80aa38dcf1754b30ab952af60e5d9ed60fce085301c158f1a6714c0f1ce"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "name": "to",
                "type": "address"
              }
            ],
            "name": "LeaseTerminated",
            "type": "event",
            "signature": "0x07b520f2e1a3f2e686818158dab32fe19d7a4976d077d20affc019b17997406c"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "to",
                "type": "address"
              }
            ],
            "name": "LeasingTerminated",
            "type": "event",
            "signature": "0xcd4c68102b1e5b751d8ea27a9a5ddc8a24dc3639092c34b7ac0f282c5ffe0c1b"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "CommitedFromBalance",
            "type": "event",
            "signature": "0x15691f9ef162518f57b746fedf540512dc8e3a26d5bd1b55accca49a700e842e"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "CommitedToBalance",
            "type": "event",
            "signature": "0xbaacf5646626eff2c662b9634151a64f582e87165a7ea2d42bec08fe9beef7bb"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "CommitedFromRented",
            "type": "event",
            "signature": "0x089fbe1cd42a8f68ef9a0073f280a16d62d31223e15bd81eefeed25769a767ae"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "CommitedToRented",
            "type": "event",
            "signature": "0xa75759184ea43cd7aeeee18efa2c6e65a6c4a31a5ecdd2e9bba3f13ac7c250c2"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "blockNumber",
                "type": "uint256"
              }
            ],
            "name": "Activated",
            "type": "event",
            "signature": "0x3ec796be1be7d03bff3a62b9fa594a60e947c1809bced06d929f145308ae57ce"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "blockNumber",
                "type": "uint256"
              }
            ],
            "name": "Deactivated",
            "type": "event",
            "signature": "0xed48e4e899b34abded07dd8f092a22585a3fdec7db6b83f3927af165bf04cb1e"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getName",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x17d7de7c"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getSymbol",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x15070401"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getDecimals",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xf0141d84"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getOwner",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x893d20e8"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x18160ddd"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "activate",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x0f15f4c0"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "deactivate",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x51b42b00"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xf2fde38b"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "owner",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x70a08231"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "spender",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x095ea7b3"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "owner",
                "type": "address"
              },
              {
                "name": "spender",
                "type": "address"
              }
            ],
            "name": "allowance",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xdd62ed3e"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "transfer",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xa9059cbb"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              },
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "transferFrom",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x23b872dd"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "commitFromBalance",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x3bb19a13"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "commitToBalance",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x814a71af"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "commitFromRented",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xe1e36220"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "numberOfTokens",
                "type": "uint256"
              }
            ],
            "name": "commitToRented",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x67feedb0"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "numberOfTokens",
                "type": "uint256"
              },
              {
                "name": "price",
                "type": "uint256"
              },
              {
                "name": "duration",
                "type": "uint256"
              }
            ],
            "name": "createOffer",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xdc35a900"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "removeOffer",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xeda26772"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "from",
                "type": "address"
              }
            ],
            "name": "leaseFrom",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function",
            "signature": "0x30b87b16"
          },
          {
            "constant": false,
            "inputs": [],
            "name": "terminateLeasing",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xce852e54"
          }
        ]`;

        this.tokenContract = new this.web3.eth.Contract(JSON.parse(abi), address);
    }

}