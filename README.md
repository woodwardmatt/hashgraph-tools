# hashgraph-tools

An example of the transaction required to update an account's mnemonic phrase, and derived private & public keys.

## Requirements
The following will be required:
- You will need an operator account to pay for the update transaction (account ID and private key)
- You will need the account details of the account to update (account ID and private key)
- This code runs under Node JS (and has the "npm start" script command already configured)

## Notes
The following are worth noting:
- This process requires the update transaction to be signed by both the operator account and the account being updated.
- The new credentials are currently logged to the console only. (You need to save / capture these for your reference, you will not be able to retrieve them again!)
- The new keys are derived from a new generated mnemonic phrase to ensure the phrase and keys remain in sync.

## Testing
The following scenarios have been tested: 
- Updating an account on the testnet
- Updating an account on the mainnet
  - An empty account
  - An account with positive hbar balance
  - An account with positive hbar balance and an NFT (one only)
