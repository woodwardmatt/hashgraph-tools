This transaction will burn either all serials for an NFT (optionally from a given serial onwards), or just the serials you specify.

> **Behaviour change:** scripts/burn.js now continues automatically, batch after batch, until every matching serial is burnt. Previous versions burnt a single batch per run, and you had to update `serial_start` and re-run for the next batch. To keep the previous behaviour, set `max_batches = 1` - re-running the script then picks up the remaining serials automatically.

## Requirements
The following will be required:
- You will need an operator account to pay for the burn transaction (account ID and private key) - *update the .env file with this info*
- You will need the token details of the token to burn (token ID and supply key) - *update the token ID in scripts/burn.js, and the supply key in the .env file*
- This code runs under Node JS (and has the `npm run burn` script command already configured)

## Getting Started
To use the Token Burn script:
- Copy `.env.example` to `.env` (if you haven't already) and fill in your operator account and supply key
- Update the settings in the "EDIT ZONE" at the top of scripts/burn.js (see below)
- Run `npm run burn`

## Settings
The following settings are found in the "EDIT ZONE" at the top of scripts/burn.js:

| Setting | Description |
|---|---|
| `tokenId` | The Token ID of the NFT collection to burn from. |
| `all_serials` | `true` to burn all serials held by the treasury (from `serial_start` onwards). `false` to burn only the serials listed in `serials`. |
| `serials` | The specific serials to burn when `all_serials` is `false` (e.g. `[1,5,6,10]`). |
| `serial_start` | When `all_serials` is `true`, only serials from this number onwards are burnt (e.g. `1` for all, `11` for serial 11 onwards). |
| `batch_size` | The number of serials burnt per transaction. Hedera allows a maximum of 10 - larger values are reduced to 10. |
| `max_batches` | The maximum number of batches burnt per run. `0` (the default) means no limit - every matching serial is burnt. `1` burns a single batch per run (the previous behaviour). |

## How it works
- Only NFTs held by the token's treasury account can be burnt. Before burning, the script asks the Hedera mirror node which serials the treasury currently holds, and only burns those.
- This means serials that have already been burnt, have been transferred out of the treasury, or were never minted are skipped automatically. (Previously, a batch containing any of these would cause the whole burn transaction to fail.)
- When burning specific serials, any that the treasury doesn't hold are skipped and listed in the output.
- Serials are burnt highest first, in batches of `batch_size`. Each batch's serials and status are logged as it completes, along with the total supply before and after the burn.
- If `max_batches` stops the run early, the script tells you how many serials remain. Simply re-run the script to continue.

## Notes
The following are worth noting:
- The public mirror node for your network (mainnet / testnet / previewnet) is used by default. If you use your own mirror node, set `HEDERA_MIRROR_REST_URL` in your .env file.
- The mirror node can take a few seconds to reflect recent transactions. If you've just minted, transferred or burnt NFTs, wait a few seconds before running the script.
- Burning is permanent. It's worth trying a burn on testnet first, or using `max_batches = 1` to check the first batch before burning a whole collection.
- There is a YouTube video available for this over at: https://youtu.be/eviD-APyHJ8 (recorded before the behaviour change above).

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/tokens/burn
- https://docs.hedera.com/reference/rest-api
