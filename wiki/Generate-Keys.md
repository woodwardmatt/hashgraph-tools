This transaction generates and outputs new key pairs for: 'Admin Key', 'Supply Key', 'Pause Key', 'Freeze Key', and 'Wipe Key'.

## Requirements
The following will be required:
- Local code with sdk package installed only (e.g. npm install after downloading the code) - no account or .env values are needed, and nothing is sent to the network
- This code runs under Node JS (and has the `npm run generate-keys` script command already configured)

## Getting Started
To use the Generate Key script:
- Update the `keys` list at the top of the script if you need a different set of keys
- Run `npm run generate-keys`

## Notes
The following are worth noting:
- Each key is an ECDSA (secp256k1) key, derived from its own new mnemonic phrase. The output includes the mnemonic phrase, the DER-encoded private / public keys, and the EVM (raw hex) private / public keys and EVM address.
- The keys are only ever output in the terminal and not stored anywhere. Please store them somewhere safe!

## References:
The following materials were referenced / used in creating this code:
- https://docs.hedera.com/native/keys/mnemonic-generate
