# Blake3 For Solidity

This is an implementation of the blake3 hash function in solidity with hardhat test coverage and deployment.

## Setup
```
$ cp .env.example .env
```
Add at least your private keys to the `.env` file and the coinmarketcap API key.


## Building
```
$ npm install
$ npx hardhat compile
```

## Testing
```
$ npx hardhat test
```


## Debugging
Start the local node:
```
$ npx hardhat node
```

Connect the hardhat console:
```
$ npx hardhat console --network localhost
```
Now you can use the console to interact with the contract (with ethers.js preloaded).