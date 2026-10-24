This transaction updates an account's key to a 3 of 3 threshold key, making it a multi-signature account. Once updated, all three keys must sign any future transaction from the account.

## Requirements
The following will be required:
- You will need an operator account to pay for the update transaction (account ID and private key) - *update `OPERATOR_ID` and `OPERATOR_KEY` in the .env file with this info*
- You will need the account details of the account to update (account ID and current private key) - *update `ACCOUNT_ID` and `PRIVATE_KEY` in the .env file with this info*
- You will need the three private keys that will make up the threshold key - *paste these into account_key_to_threshold_key.js where it says `<Insert Private Key Here (DER or hex)>`. The [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) script can create these for you.*
- This code runs under Node JS (and has the `npm run account-key-threshold` script command already configured)

## Getting Started
To use the Account Key to Threshold Key script:
- Run `npm run account-key-threshold`
- **Important** - Remove the private keys from the script after running it, and do not commit them.

## Notes
The following are worth noting:
- The update is signed by the account's current key, and by all three new keys.
- DER-encoded keys are detected automatically. For raw hex ED25519 keys, change `'ECDSA'` to `'ED25519'` next to each key in the script (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats)).
- To use a different threshold (e.g. 2 of 3), change the number in `new KeyList(multisigPublicKeys, 3)`.
- Make sure you can access all of the new keys before running this - if you lose enough of them to fall below the threshold, you will lose access to the account.
- The maximum transaction fee is set to 2 hbars.

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/keys/threshold-key
- https://docs.hedera.com/native/accounts/update
