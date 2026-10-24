This repo is an informal collection of example transactions coded against the Hedera JS SDK.

## Contents

The following are currently included:

* [Account Key Reset](https://github.com/woodwardmatt/hashgraph-tools/wiki/Account-Key-Reset) - (scripts/account_key_reset.js) An example of the transaction required to update an account's mnemonic phrase, and derived private & public keys.
* [Account Key to Threshold Key](https://github.com/woodwardmatt/hashgraph-tools/wiki/Account-Key-to-Threshold-Key) - (scripts/account_key_to_threshold_key.js) An example of how to update your account to be a multi-signature (3 of 3 threshold key) account.
* [Burning NFTs](https://github.com/woodwardmatt/hashgraph-tools/wiki/Burn-NFTs) - (scripts/burn.js) An example of a transaction that will burn either all serials for an NFT, or just the serials you specify (only serials held by the treasury are burnt, in batches).
* [Generate Accounts](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Accounts) - (scripts/generate_accounts.js) An example of a transaction that will create a list of new accounts and output all credentials.
* [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) - (scripts/generate_keys.js) An example of how to create a list of new keys for use with accounts, or NFT keys etc.
* [Generate Token with Threshold Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Token-with-Threshold-Keys) - (scripts/generate_token_with_threshold_keys.js) An example of creating a HTS token with 3 of 3 threshold keys for the token's supply / admin.
* [Generate Topic with Single Submit Key](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Topic-with-Single-Submit) - (scripts/generate_topic_with_single_submit.js) An example of creating a HCS topic where only one key can submit messages.
* [Generate Topic with Threshold Submit Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Topic-with-Threshold-Submit) - (scripts/generate_topic_with_threshold_submit.js) An example of creating a HCS topic where any one of three keys can submit messages.
* [Minting NFTs](https://github.com/woodwardmatt/hashgraph-tools/wiki/Minting-NFTs) - (scripts/mint.js) An example of the transactions required to mint NFTs underneath a parent Token ID (i.e. collection).
* [Token Grant KYC](https://github.com/woodwardmatt/hashgraph-tools/wiki/Token-Grant-KYC) - (scripts/token_grant_kyc.js) An example of granting KYC to an account for a token that uses a KYC Key.
* [Token Key Reset](https://github.com/woodwardmatt/hashgraph-tools/wiki/Token-Key-Reset) - (scripts/token_key_reset.js) An example of a transaction that updates the following keys on a token (that uses an Admin Key): Supply, Pause, Freeze, Wipe.

## Getting Started

To use these scripts:

* Install [NodeJS](https://nodejs.org/en/download) (version 20 or later).
* Download / Clone the repo to your local machine, and install all dependencies using `npm install` (using the terminal inside VS Code for example).
* Copy the `.env.example` file to `.env`, and fill in the values the script you want to run needs (each page below lists these). **Never commit or share your `.env` file.**
* Run the script you want using its npm command (below), e.g. `npm run burn`. These commands load your `.env` file for you.

| Script | Command |
|---|---|
| scripts/mint.js | `npm run mint` |
| scripts/burn.js | `npm run burn` |
| scripts/generate_accounts.js | `npm run generate-accounts` |
| scripts/generate_keys.js | `npm run generate-keys` |
| scripts/generate_token_with_threshold_keys.js | `npm run generate-token-threshold` |
| scripts/generate_topic_with_single_submit.js | `npm run generate-topic-single` |
| scripts/generate_topic_with_threshold_submit.js | `npm run generate-topic-threshold` |
| scripts/account_key_reset.js | `npm run account-key-reset` |
| scripts/account_key_to_threshold_key.js | `npm run account-key-threshold` |
| scripts/token_key_reset.js | `npm run token-key-reset` |
| scripts/token_grant_kyc.js | `npm run token-grant-kyc` |

`npm start` still runs scripts/mint.js. If you're following an older video that edits the `start` script in package.json, that still works too - just use `"start": "node -r dotenv/config scripts/<script>.js"` (the scripts now live in the `scripts/` folder).

**Tip:** Set `HEDERA_NETWORK=testnet` and try a script on testnet before using it on mainnet.

**Updating from an older version?**
- The `.env` file is no longer tracked by the repo. Back up your `.env` file before pulling the latest changes, and restore it afterwards.
- The scripts have moved into the `scripts/` folder (e.g. `mint.js` is now `scripts/mint.js`). If you've edited the settings in any script, back up your changes (or run `git stash`) before pulling, then re-apply them to the script in its new location.

## Key Formats

Private keys in your `.env` file (and pasted into the scripts) can be either:

* **DER-encoded** (e.g. starting `3030...` for ECDSA, or `302e...` for ED25519) - the key type is detected automatically.
* **Raw hex** (with or without a `0x` prefix) - these are read as ECDSA by default. For a raw hex ED25519 key in your `.env` file, add a matching `<NAME>_TYPE=ED25519` entry (e.g. `OPERATOR_KEY_TYPE=ED25519`).

## Disclaimer

The following disclaimers are noted:

* Use of this code is at your own risk.
* No warranty is implied in the sharing of this code.
* No liability is assumed in the sharing of this code.
* This code has been created for a development environment use-case only (i.e. not for production grade applications).
