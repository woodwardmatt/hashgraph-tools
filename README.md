# hashgraph-tools
The following are currently included:
- [Account Key Reset](https://github.com/woodwardmatt/hashgraph-tools/wiki/Account-Key-Reset) - (scripts/account_key_reset.js) An example of the transaction required to update an account's mnemonic phrase, and derived private & public keys.
- [Account Key to Threshold Key](https://github.com/woodwardmatt/hashgraph-tools/wiki/Account-Key-to-Threshold-Key) - (scripts/account_key_to_threshold_key.js) An example of how to update your account to be a multi-signature (3 of 3 threshold key) account.
- [Burning NFTs](https://github.com/woodwardmatt/hashgraph-tools/wiki/Burn-NFTs) - (scripts/burn.js) An example of the burn transaction used to burn NFTs. Only serials currently held by the treasury are burnt (looked up via the mirror node), in batches of up to 10.
  - **Behaviour change:** scripts/burn.js now continues automatically, batch after batch, until every matching serial is burnt (previously it burnt a single batch per run). Set `max_batches = 1` to burn one batch per run as before.
- [Generate Accounts](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Accounts) - (scripts/generate_accounts.js) An example of a transaction that will create a list of new accounts (and output all credentials).
- [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) - (scripts/generate_keys.js) A quick utility to generate new key pairs for working with NFTs.
- [Generate Token with Threshold Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Token-with-Threshold-Keys) - (scripts/generate_token_with_threshold_keys.js) An example of creating a HTS token with 3 of 3 threshold keys for the token's supply / admin.
- [Generate Topic with Single Submit Key](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Topic-with-Single-Submit) - (scripts/generate_topic_with_single_submit.js) An example of creating a HCS topic where only one key can submit messages.
- [Generate Topic with Threshold Submit Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Topic-with-Threshold-Submit) - (scripts/generate_topic_with_threshold_submit.js) An example of creating a HCS topic where any one of three keys can submit messages.
- [Minting NFTs](https://github.com/woodwardmatt/hashgraph-tools/wiki/Minting-NFTs) - (scripts/mint.js) An example of the transactions required to mint NFTs underneath a parent Token ID (i.e. collection).
- [Token Grant KYC](https://github.com/woodwardmatt/hashgraph-tools/wiki/Token-Grant-KYC) - (scripts/token_grant_kyc.js) An example of granting KYC to an account for a token that uses a KYC Key.
- [Token Key Reset](https://github.com/woodwardmatt/hashgraph-tools/wiki/Token-Key-Reset) - (scripts/token_key_reset.js) An example of the transaction used to reset the keys on your Tokens.

## Getting Started
To use these scripts:
- Download / Clone the repo to your local machine
- Install [NodeJS](https://nodejs.org/en/download) (version 20 or later)
- Install all dependencies using `npm install` (using the terminal inside VSCode for example)
- Copy `.env.example` to `.env` and fill in the values the script needs (see the [wiki](https://github.com/woodwardmatt/hashgraph-tools/wiki/) page for each script). **Never commit or share your `.env` file.**
- Run the script you want using its npm command, e.g. `npm run burn` (these load your `.env` file for you)

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

`npm start` still runs scripts/mint.js.

Private keys can be DER-encoded or raw hex, ECDSA or ED25519 - see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki/#key-formats).

**Updating from an older version?**
- The `.env` file is no longer tracked by the repo. Back up your `.env` file before pulling the latest changes, and restore it afterwards.
- The scripts have moved into the `scripts/` folder (e.g. `mint.js` is now `scripts/mint.js`). If you've edited the settings in any script, back up your changes (or run `git stash`) before pulling, then re-apply them to the script in its new location.

## Further Information
Please see the [wiki](https://github.com/woodwardmatt/hashgraph-tools/wiki/) for further notes / information on each transaction.

The wiki pages live in the [wiki/](wiki/) folder of this repo and are published to the wiki automatically when changes are pushed to main. Please make any documentation changes there (edits made directly on the wiki will be overwritten).

## Disclaimer
The following disclaimers are noted: 
- Use of this code is at your own risk.
- No warranty is implied in the sharing of this code.
- No liability is assumed in the sharing of this code.
- This code has been created for a development environment use-case only (i.e. not for production grade applications). 

## Donations
If you've found these scripts useful and you'd like to donate to support my work, please send your donation to Hedera Account ID: 0.0.508156
