This transaction has been created to mint NFT's under a parent token ID. You can use this to create a collection of totally unique 1/1 NFTs, or generate a supply (i.e. copies) of a design within a collection.

## Requirements
The following will be required:
- You will need a (minimum) of one account to pay for the transactions (account ID and private key) and to be the treasurer (i.e. custodian) of the NFTs you mint - *update `OPERATOR_ID` / `OPERATOR_KEY` and `TREASURY_ID` / `TREASURY_KEY` in the .env file with this info (these can be the same account)*
- You will need a supply key for the collection (required for minting) - *update `SUPPLY_KEY` in the .env file. The [Generate Keys](https://github.com/woodwardmatt/hashgraph-tools/wiki/Generate-Keys) script can create this for you.*
- Optionally, the other token keys - *`ADMIN_KEY`, `PAUSE_KEY`, `FREEZE_KEY` and `WIPE_KEY` in the .env file. Any left blank are not set on the collection.*
- You will need a JWT and gateway URL from [Pinata](https://app.pinata.cloud/register) to store your NFT assets (media & metadata) on IPFS - *update `PINATA_JWT` and `GATEWAY_URL` in the .env file*
- This code runs under Node JS (version 20 or later) so a few recommendations on software can be found below (assuming a Windows Operating System is in use):
  - [VS Code](https://code.visualstudio.com/Download)
  - [WSL (Windows Subsystem Linux)](https://learn.microsoft.com/en-us/windows/wsl/install)
  - [WSL - Remote Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)
  - [Windows Terminal](https://aka.ms/terminal)
  - [Git](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git)
  - [NodeJS](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

## Getting Started
To use the Mint script:
- Update the settings in the "EDIT ZONE" at the top of mint.js (see below)
- Run `npm run mint` (or `npm start`, which also runs mint.js)

The following YouTube video playlist has been created to support walking you through these scripts: https://www.youtube.com/playlist?list=PL0P3qsr1eNTfrWrm7atE1QYsUBZBUNwZZ

## Settings
The following settings are found in the "EDIT ZONE" at the top of mint.js:

| Setting | Description |
|---|---|
| `mediaPath` | The absolute path to the folder holding your NFT media files (ending with a `/`). |
| `creator` | The creator name added to each NFT's metadata. |
| `collectionName` | The name (and symbol) of the collection token. |
| `existingCollectionId` | Leave blank to create a new collection. To add more NFTs to an existing collection, enter its Token ID (the supply key must match). |
| `maxCollectionSupply` | The maximum number of NFTs in the collection (when created). |
| `supply` | The number of copies to mint of each NFT (same image & metadata). |
| `autoSupply` | Set above 0 to mint that many NFTs with different images but the same metadata (e.g. POAPs) - see below. |
| `autoSupplyStart` | The number to start `autoSupply` from (typically 1, but higher if restarting after errors). |
| `nfts` | The list of NFTs to mint - name, description, image file name, mime-type, properties and attributes. |
| `fees` | Optional royalty fees (maximum 10) - each with a royalty percentage, a fallback fee (in hbar) and the fee collector's account ID. |

## Notes
The following are worth noting:
- Each NFT's media file is uploaded to IPFS (via Pinata), then its metadata is built and uploaded, following [HIP-412](https://github.com/hiero-ledger/hiero-improvement-proposals/blob/main/HIP/hip-412.md) (using the opensea format to allow for traits).
- When using `autoSupply`, the image file names are prefixed with a 2-digit number (`01`, `02` ... `10`, `11` ...). For example, with an `image` of `-file.png` the script looks for `01-file.png`, `02-file.png` and so on in your `mediaPath` folder.
- If an upload to Pinata fails (e.g. a file is missing), the reason is logged and that NFT is skipped (not minted). Use `autoSupplyStart` to pick up where you left off.
- Files are uploaded to Pinata's public IPFS network, using Pinata's current (v3) Files API. If your Pinata JWT is a scoped key, make sure it has permission to upload files (Files: Write) - older scoped keys may need to be re-created. An admin key also works.
- "Additional" files beyond the preview image (in `properties.files`) should be uploaded to IPFS in advance and referenced in the `nfts` list.
- Keys can be ECDSA or ED25519 (see [Key Formats](https://github.com/woodwardmatt/hashgraph-tools/wiki#key-formats)).

## Reference:
- [Proposed NFT Schema](https://docs.google.com/document/d/1-MrvdwC2QAUhebzGGHAukR4E8l2eiBtyE9COeeIoL0Q/edit?usp=sharing)
- [HIP-412 - NFT Metadata Standard](https://github.com/hiero-ledger/hiero-improvement-proposals/blob/main/HIP/hip-412.md)
- [Mime-Types Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types)
- https://docs.hedera.com/native/tokens/define
- https://docs.hedera.com/native/tokens/mint
- https://docs.hedera.com/native/tokens/custom-fees
