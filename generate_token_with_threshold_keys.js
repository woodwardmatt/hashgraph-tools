// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { Hbar,TokenCreateTransaction,KeyList } from "@hashgraph/sdk";

async function main(){

    // Setup Client 
    let client = new Connection().client;     

    // Add Keys for Multisig (based on 3 accounts)
    // Note: DER keys are detected automatically. For raw hex ED25519 keys, change 'ECDSA' to 'ED25519'
    const privateKey1 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');
    const privateKey2 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');
    const privateKey3 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');

    // Create a `KeyList` that represents a 3 of 3 multisig threshold
    const multisigPublicKeys = [(await privateKey1).publicKey, (await privateKey2).publicKey, (await privateKey3).publicKey];
    const multisigKeyList = new KeyList(multisigPublicKeys, 3);

    //Log Keys (**Only visual output at this stage**)
    console.log('These are your new credentials...');
    console.log('Multisig Keylist ' + multisigKeyList.toString());    

    //Create the transaction and freeze for manual signing
    const transaction = await new TokenCreateTransaction()
        .setTokenName("<Insert Token Name>")
        .setTokenSymbol("<Insert Token Symbol>")
        .setTreasuryAccountId("<Insert Treasury Account ID>")
        .setInitialSupply(0)
        .setAdminKey(multisigKeyList)
        .setSupplyKey(multisigKeyList)
        .setDecimals(8)
        .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
        .freezeWith(client);

    //Sign the transaction with the all threshold key(s)
    const SignedByFirstTx = await transaction.sign(privateKey1);
    const SignedBySecondTx = await SignedByFirstTx.sign(privateKey2);
    const SignedByThirdTx = await SignedBySecondTx.sign(privateKey3);

    // Sign the transaction with our client
    const txResponse = await SignedByThirdTx.execute(client);

    // Request the receipt of the transaction (so we can get the Token Id we've created)
    const receipt = await txResponse.getReceipt(client);

    // Get the Token ID
    const tokenId = receipt.tokenId;

    // Output New Token 
    console.log("The new token ID is " + tokenId);
}

main();