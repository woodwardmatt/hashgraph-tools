This transaction updates the following keys on a token using an Admin Key: Supply, Pause, Freeze, Wipe.

## Requirements
The following will be required:
- You will need an operator account to pay for the update transaction (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- You will need the token ID of the token to update - *update `tokenId` at the top of scripts/token_key_reset.js*
- You will need the token's current admin key - *update `ADMIN_KEY` in the .env file*
- You will need the new keys to set on the token - *update `SUPPLY_KEY`, `PAUSE_KEY`, `FREEZE_KEY` and `WIPE_KEY` in the .env file (all four are required). The [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) script can create these for you.*
- This code runs under Node JS (and has the `npm run token-key-reset` script command already configured)

## Getting Started
To use the Token Key Reset:
- Run `npm run token-key-reset`

## Notes
The following are worth noting:
- The Admin Key is not updated during this process.
- Keys can be ECDSA or ED25519 (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats)).

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/tokens/update
