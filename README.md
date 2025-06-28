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


### Running locally
First, install the package with
```bash 
yarn
```

Then just build it with 
```bash
yarn dev
```

and Just open [localhost:3000](http://localhost:3000)

### Storage & Database access
This tool uses RIDB and Identus store to provide a secure and reliable storage wrapper for your needs.

Identus storage can be extended to include and integrate new models and functionality to adapt to your business requirements

### Advanced configuration
There is 2 ways of using this product. By setting environment variables anyone using the website you deploy will be using the same mediator, resolver and blockfrost api key.

**WHY?** Makes it easier to deploy a semi-managed service. Website will automatically configure some specific env vars.

**Can I opt out?** Yes, defining the environment variables is totally optional, if you don't define them each user entering your website will have to configure their own. They can do by entering ```/app/settings/``` 

#### Variables
When these environment variables are set, the corresponding settings 
will be managed server-side and cannot be modified by users in the UI

Blockfrost API Key for Cardano blockchain interactions
If set, users cannot modify this setting in the Settings page
```bash
BLOCKFROST_API_KEY=your_blockfrost_api_key_here
```

Mediator DID for agent connections
If set, users cannot modify this setting in the Settings page  
```bash
MEDIATOR_DID_URL=did:peer:example_mediator_did
```

PRISM DID Resolver URL for resolving PRISM DIDs
If set, users cannot modify this setting in the Settings page
```bash
PRISM_RESOLVER_URL=https://your-prism-resolver-url.com
```

This url must be a prism did universal resolver endpoint, or any endpoint that can resolve a did http://anything/did/  <- we would pass the did to query in the url directly but your domain must go without, just http://anything/did/ 
