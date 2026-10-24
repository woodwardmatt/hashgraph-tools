This transaction generates and outputs details for a list of new accounts. This can be useful for re-creating a list of required accounts for your applications.

## Requirements
The following will be required:
- You will need an operator account to pay for creating the accounts, and their initial hbar balance (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- This code runs under Node JS (and has the `npm run generate-accounts` script command already configured)

## Getting Started
To use the Generate Account script:
- Update the `accounts` list at the top of the script with the accounts you want to create. Each entry has a `name` (used in the output only) and an `evm` flag:
  - `"evm": true` - creates an ECDSA (secp256k1) account with an EVM address alias, and also outputs the EVM keys and address.
  - `"evm": false` - creates an ED25519 account.
- Update the initial balance in the script (`setInitialBalance`) if required - this is paid by the operator account for each account created.
- Run `npm run generate-accounts`

## Notes
The following are worth noting:
- The account and associated keys (and mnemonic phrase) are only ever output in the terminal and not stored anywhere. Please store them somewhere safe!

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/accounts/create
