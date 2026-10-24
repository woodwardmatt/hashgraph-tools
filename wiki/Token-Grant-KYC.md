This transaction grants KYC to an account for a token. For tokens created with a KYC Key, accounts must be granted KYC before they can send or receive the token.

## Requirements
The following will be required:
- You will need an operator account to pay for the transaction (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- You will need the token's KYC key - *update `KYC_KEY` in the .env file*
- You will need the token ID, and the account ID to grant KYC to - *update `tokenId` and `accountId` at the top of scripts/token_grant_kyc.js*
- This code runs under Node JS (and has the `npm run token-grant-kyc` script command already configured)

## Getting Started
To use the Token Grant KYC script:
- Run `npm run token-grant-kyc` - the transaction status is output when complete

## Notes
The following are worth noting:
- The account must already be associated with the token.
- The KYC key can be ECDSA or ED25519 (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats)).

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/tokens/enable-kyc
