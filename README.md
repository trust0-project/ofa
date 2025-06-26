<p align="center">
 <h1 align="center">Identus Offline first, decentralised agent</h1>
  <h3 align="center">A secure light-weight and dependency free database wrapper for the web.</h3>
  <div style="margin:auto;width:300px;">
  <img src="https://raw.githubusercontent.com/trust0-project/RIDB/refs/heads/main/logo.svg" alt="Trust0" width="128" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/hyperledger-identus/.github/f21f0091231d65d63fb0cd2101df3eb6f349b1ec/resources/images/hyperledger-identus.svg" alt="Identus" width="128">
  </div> 
</p>


### Introduction
This project uses the Hyperledger Identus Typescript SDK to build an offline first self sovereign identity agent.

This project bridges the gap Identity and Web2/3 projects in Cardano have, you no longer need to deploy any infrastructure to run Identity solutions in Cardano blockchain.

Offline first means:
* Almost Zero infrastructure
* Data is stored locally and password protected, you own it
* Issue your own dids with no middle party using any CIP-30 compatible Wallet (Lace, CCVault, etc)
* Identity (DIDS) you own can be published on chain, making verification fully decentralised as u no longer need to trust a middle party to verify signatures


### Storage & Database access
This tool uses RIDB and Identus store to provide a secure and reliable storage wrapper for your needs.

Identus storage can be extended to include and integrate new models and functionality to adapt to your business requirements

### Running this locally
```bash
yarn
npm run dev
```

Then, just open [http://localhost:3000](http://localhost:3000)