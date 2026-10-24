This transaction has been created to reset both the mnemonic phrase and keys associated with an Hedera account.

## Requirements
The following will be required:
- You will need an operator account to pay for the update transaction (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- You will need the account details of the account to update (account ID and private key) - *update `ACCOUNT_ID` and `PRIVATE_KEY` in the .env file with this info*
- This code runs under Node JS (and has the `npm run account-key-reset` script command already configured)

## Getting Started
To use the Account Key Reset:
- Update the .env file with the operator (and account) ID and keys (make sure you remove these after executing the code and do not leave them sat in the file).
- From the root of the project, on the command line / terminal, run `npm run account-key-reset` - the new keys and mnemonic phrase will be written to the console only, and not stored anywhere.
- **Important** - Store the regenerated keys / phrase safely, and remove the original id's and keys from the .env file.

## Notes
The following are worth noting:
- This process requires the update transaction to be signed by both the operator account and the account being updated (old key), as well as the new key.
- The new keys are ECDSA (secp256k1) keys. The account's existing key can be ECDSA or ED25519 (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats) - e.g. set `PRIVATE_KEY_TYPE=ED25519` for a raw hex ED25519 key).
- The new credentials are currently logged to the console only. (You need to save / capture these for your reference, you will not be able to retrieve them again!)
- The new keys are derived from a new generated mnemonic phrase to ensure the phrase and keys remain in sync.
- The maximum transaction fee is set to 2 hbars.
- Large parts of this code were derived directly from the Hedera Developer Docs & Samples.

## Testing
The following scenarios have been tested:
- Updating an account on the testnet
- Updating an account on the mainnet
  - An empty account
  - An account with positive hbar balance
  - An account with positive hbar balance and an NFT (one only)
  - (**Not Tested**) An account with positive hbar balance and multiple NFTs

## Assumptions
The following assumptions are awaiting confirmation:
- Multiple NFTs held in an account will not be affected by a key change (input from Hedera Developer Advocates / Engineers suggests this will be fine)

## Improvements
The following improvements could be included in future:
- More defensive coding around operations / variables

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native
- https://docs.hedera.com/native/keys/mnemonic-generate
- https://docs.hedera.com/native/keys/mnemonic-recover
- https://docs.hedera.com/native/accounts/update
