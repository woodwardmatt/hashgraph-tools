# hashgraph-tools
The following are currently included: 
- (account_key_reset.js) An example of the transaction required to update an account's mnemonic phrase, and derived private & public keys.
- (mint.js) An example of the transactions required to mint NFTs underneath a parent Token ID (i.e. collection) - More info coming....(bear with me)

## Requirements
The following will be required:
- You will need an operator account to pay for the update transaction (account ID and private key) - *update the .env file with this info*
- You will need the account details of the account to update (account ID and private key) - *update the .env file with this info*
- This code runs under Node JS (and has the "npm start" script command already configured)

## Notes
The following are worth noting:
- This process requires the update transaction to be signed by both the operator account and the account being updated.
- The new credentials are currently logged to the console only. (You need to save / capture these for your reference, you will not be able to retrieve them again!)
- The new keys are derived from a new generated mnemonic phrase to ensure the phrase and keys remain in sync.
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
- Try catch Exception blocks with logging around operations

## References: 
The following materials were referenced / used in creating this code: 
- https://docs.hedera.com/guides/docs/sdks
- https://docs.hedera.com/guides/docs/sdks/keys/generate-a-mnemonic-phrase
- https://docs.hedera.com/guides/docs/sdks/keys/recover-keys-from-a-mnemonic-phrase
- https://docs.hedera.com/guides/docs/sdks/cryptocurrency/update-an-account

## Disclaimer
The following disclaimers are noted: 
- Use of this code is at your own risk.
- No warranty is implied in the sharing of this code.
- No liability is assumed in the sharing of this code.
- This code has been created for a development environment use-case only (i.e. not for production grade applications). 
