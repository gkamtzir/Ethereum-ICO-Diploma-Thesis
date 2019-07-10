# Diploma Thesis on the Ethereum Blockchain

This is the codebase of my diploma thesis in Electrical Engineering and Computer Engineering at Aristotle University of Thessaloniki. The thesis is focused on the process of developing a fully fledged, secure and easy to use token and ICO procedure with unique features that most other tokens do not currently have. The development starts from designing detailed flowcharts of the use cases and the overall architecture of the system to the unit tests and the actual development of the product.

## Project Structure

- *./contracts/*<br />
The actual "smart contract" codebase.

- *./contracts/contracts/*<br />
The actual smart contracts (solidity code) of the project.

- *./contracts/diagrams/*<br />
All the supported use cases of the project as flowcharts.

- *./contracts/interfaces/*<br />
The interfaces that smart contracts implement.

- */contracts/libraries/*<br />
This needed libraries for the smart contracts.

- *./migrations/*<br />
The migration scripts that compile and deploy the project through the [Truffle Suit](https://github.com/trufflesuite/truffle).

- */src/*<br />
The web application code written in AngularJS.

- *./test/*<br />
The unit tests of each individual smart contract.

- *./uml/*<br />
The uml class diagrams that describe the inner structure of the project.

- *./coverage/*<br />
The static webpage that hosts the unit-test coverage report.

- *./docs/*<br />
The codebase for the webpage that hosts the documentation.

## Installation Guide

#### Clone the repo

```
git clone https://github.com/gkamtzir/Ethereum-ICO-Diploma-Thesis.git
cd Ethereum-ICO-Diploma-Thesis
```

#### Prerequisites

In order to run and deploy the project you need to have locally installed all the needed packages. To do so, run the following command:

```
npm install
```

*Important note: sudo privileges may be required.*

The most important packages are:
- [Truffle Suit](https://github.com/trufflesuite/truffle)
- [Ganache](https://github.com/trufflesuite/ganache)
- [Web3.js](https://github.com/ethereum/web3.js/)

The truffle suit is used to compile, test and deploy the smart contracts. However, to deploy the smart contracts you will also need an Ethereum blockchain. You can deploy it on Ropsten, Rinkeby or even the Main Net. However, the last option is not recommended for development purposes due to the high costs of deployment and interaction with the project. It is highly recommended to use an Ethereum blockhain that runs locally on your machine. This is where the Ganache comes into play. With Ganache you can create your own local blockchain to test your project. You can install it via npm by running:

```
./node_modules/.bin/ganache-cli
```

*Important note: sudo privileges may be required.*<br />
*You can also use the GUI version of Ganache. To do so, visit the [Ganache](https://truffleframework.com/ganache) official website.*

To interact with project's smart contracts you will need the Web3 package. Web3.js basically lets you interact with the blockchain via HTTP calls.

#### Compile and Deploy

To compile and deploy the project on Ganache you need to configure the truffle-config.js file. In the *network* key make sure there is a Javascript object similar to the following:

```Javascript
development: {
  host: "127.0.0.1",     // Localhost (default: none)
  port: 8545,            // Standard Ethereum port (default: none)
  network_id: "*",       // Any network (default: none)
}
```

*Important note: You may have to adjust the host and the port to match your Ganache configuration.*

To deploy run:

```
./node_modules/.bin/truffle migrate
```

To interact with the project on the blockchain run the following:

```
./node_modules/.bin/truffle console
```

From here you can interact with the smart contracts through the Web3.js [API](https://web3js.readthedocs.io/en/1.0/). Check out the API documentation for more information on that.

#### Unit Tests

To run the unit test scripts located in the *./test/ folder just run the following:

```
./node_modules/.bin/truffle test
```

*Important note: sudo privileges may be required.*

#### Web Application

To run the web application, first you need to deploy the contracts, exactly as described before. Then, you have to copy contracts' addresses and paste them in the */src/app.ts* main file. The contracts are the following:

- OpenHouseToken
- PrivateSale
- PreICOSale
- ICOSale

```
module.constant("OpenHouseTokenContractAddress", "0xc65aA31c9400E20EA6965f6461fd0DDAB0a6Fc80");
module.constant("PrivateSaleContractAddress", "0x8c76d227C6A4f5cD8699456B5b9166f784A0d76d");
module.constant("PreICOSaleContractAddress", "0x9707960e52Aa129b20fe1121665F75e411EA52A3");
module.constant("ICOSaleContractAddress", "0x6142BB9cCDf5eb2d4e4440a658739c4a8dA0075B");
```

Lastly, start the local webserver by running:

```
npm run start
```

You can now use the web application to interact with the smart contracts.

#### Unit-Test Coverage
The unit-test coverage report is created by [solidity-coverage](https://www.npmjs.com/package/solidity-coverage) package. To create the report you need to run the following command:

```
./node_modules/.bin/solidity-coverage
```

*Important note: before running the coverage tool you need to manually replace the contents of node-modules/solidity-parser-sc/build/parser.js with this [one](https://raw.githubusercontent.com/maxsam4/solidity-parser/solidity-0.5/build/parser.js). This replacement is mandatory due to a bug in the coverage tool in which the **payable** keyword is interpreted incorrectly. More information can be found [here](https://github.com/sc-forks/solidity-coverage/issues/316) and [here](https://github.com/sc-forks/solidity-parser/pull/18).*

The full coverage can be found [here](http://83.212.115.201/ethereum-thesis/coverage).

#### Documentation
A details documentation of the smart contracts can be found at [here](http://83.212.115.201/ethereum-thesis/documentation). The documentation is created automatically by the [solidity-docgen](https://www.npmjs.com/package/solidity-docgen) package.

#### Authors

**George Kamtziridis, gkamtzir@auth.gr**
