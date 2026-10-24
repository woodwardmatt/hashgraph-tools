This transaction creates a new HTS (fungible) token, where the token's admin and supply keys are a 3 of 3 threshold key. This means all three keys must sign to update the token, or to mint / burn its supply.

## Requirements
The following will be required:
- You will need an operator account to pay for the token creation (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- You will need the three private keys that will make up the threshold key - *paste these into generate_token_with_threshold_keys.js where it says `<Insert Private Key Here (DER or hex)>`. The [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) script can create these for you.*
- You will need the token details - *update the token name, symbol and treasury account ID in the script where it says `<Insert Token Name>`, `<Insert Token Symbol>` and `<Insert Treasury Account ID>`*
- This code runs under Node JS (and has the `npm run generate-token-threshold` script command already configured)

## Getting Started
To use the Generate Token with Threshold Keys script:
- Run `npm run generate-token-threshold` - the new Token ID is output when complete
- **Important** - Remove the private keys from the script after running it, and do not commit them.

## Notes
The following are worth noting:
- The token is created with 8 decimals and an initial supply of 0 (update `setDecimals` / `setInitialSupply` in the script if required).
- The treasury account must also sign the token creation. The script doesn't sign with a separate treasury key, so use your operator account as the treasury (or add the treasury's signature to the script).
- DER-encoded keys are detected automatically. For raw hex ED25519 keys, change `'ECDSA'` to `'ED25519'` next to each key in the script (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats)).
- To use a different threshold (e.g. 2 of 3), change the number in `new KeyList(multisigPublicKeys, 3)`.
- The maximum transaction fee is set to 30 hbars.

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/tokens/define
- https://docs.hedera.com/native/keys/threshold-key
