# Jack-in-the-box-smart-contracts
It is an upgradeable ERC721A smart contact based on openzepplin (A library for secure smart contract development) and chiru-labs (A library for the implementation of ERC721A). ERC721A is an improved implementation of the ERC721 Non-Fungible Token Standard that supports minting multiple tokens for close to the cost of one.


# Installation
run the following command to install all the necessary modules
```console
$ npm install 
```

# Compile contract
Compile the smart contract using hardhat
```console
$ npx hardhat compile
```

**_Note_** if compilation does not take place, please run the following command
```console
$ npx hardhat compile --force
```

# Unit Testing of contract
Unit test the smart contract using hardhat
```console
$ npx hardhat test
```

## Create .env file
Add the following to your environment file .env:

```console
PRIVATE_KEY       = "6a5f8cb062a36XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
API_KEY           = "3QXEfzPrzaXPylzoH3quXXXXXXXXXXXXXXXXXXXXXXXXXX"
ETHERSCAN_API_KEY = "TGC712I9N8RRCI2Z158XXXXXXXXXXXXXXXXXXXXXXXXXX"
```

**PRIVATE_KEY** this key is used in the deployment of the contract and will be got from your metaMask wallet\
**API_KEY** this key is used to watch the events and transactions which are taken place in the contract and it will be got from your Alchemy [https://dashboard.alchemyapi.io/]/ Infura[https://infura.io/] (End points)\
**ETHERSCAN_API_KEY** this is most important and used in the verification of the contract and it can be got from your etherscan.io[etherscan.io]

# Deploy contract on Mainnet/ Testnet
Deploy your smart contract on the top the mainnet/ testnet of the ethereum network using hardhat. However, We will use the Rinkeby testnet as an example.
```console
$ hardhat run scripts/deploy.js --network rinkeby
```

# Deploy contract on localhost
Deploy your smart contract on the top the mainnet/ testnet of the ethereum network using hardhat
```console
$ hardhat run scripts/deploy.js --network localhost
```

# Learn More

The guides in the [docs site](https://docs.openzeppelin.com/contracts) will teach about different concepts, and how to use the related contracts that OpenZeppelin Contracts provides:

* [Access Control](https://docs.openzeppelin.com/contracts/access-control): decide who can perform each of the actions on your system.
* [Tokens](https://docs.openzeppelin.com/contracts/tokens): create tradeable assets or collectives, and distribute them via [Crowdsales](https://docs.openzeppelin.com/contracts/crowdsales).
* [Gas Station Network](https://docs.openzeppelin.com/contracts/gsn): let your users interact with your contracts without having to pay for gas themselves.
* [Utilities](https://docs.openzeppelin.com/contracts/utilities): generic useful tools, including non-overflowing math, signature verification, and trustless paying systems.

The [Openzepplin full API](https://docs.openzeppelin.com/contracts/api/token/ERC721) and  [ERC721A API](https://chiru-labs.github.io/ERC721A//#/upgradeable) are also thoroughly documented the ERC721 and ERC&721A, and serves as a great reference when developing your smart contract application. You can also ask for help or follow Contracts's development in the [community forum](https://forum.openzeppelin.com).

Finally, you may want to take a look at the [guides on our blog](https://blog.openzeppelin.com/guides), which cover several common use cases and good practices.. The following articles provide great background reading, though please note, some of the referenced tools have changed as the tooling in the ecosystem continues to rapidly evolve.

* [The Hitchhiker’s Guide to Smart Contracts in Ethereum](https://blog.openzeppelin.com/the-hitchhikers-guide-to-smart-contracts-in-ethereum-848f08001f05) will help you get an overview of the various tools available for smart contract development, and help you set up your environment.
* [A Gentle Introduction to Ethereum Programming, Part 1](https://blog.openzeppelin.com/a-gentle-introduction-to-ethereum-programming-part-1-783cc7796094) provides very useful information on an introductory level, including many basic concepts from the Ethereum platform.
* For a more in-depth dive, you may read the guide [Designing the Architecture for Your Ethereum Application](https://blog.openzeppelin.com/designing-the-architecture-for-your-ethereum-application-9cec086f8317), which discusses how to better structure your application and its relationship to the real world.



# Security

This project is maintained by [OpenZeppelin](https://openzeppelin.com), and developed following our high standards for code quality and security. OpenZeppelin is meant to provide tested and community-audited code.

The core development principles and strategies that OpenZeppelin is based on include: security in depth, simple and modular code, clarity-driven naming conventions, comprehensive unit testing, pre-and-post-condition sanity checks, code consistency, and regular audits.


Please report any security issues you find to security@openzeppelin.org.

# Contribute

OpenZeppelin exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide](CONTRIBUTING.md)!

# License

OpenZeppelin is released under the [MIT License](LICENSE).
