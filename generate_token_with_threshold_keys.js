// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Hbar,TokenCreateTransaction,KeyList,PrivateKey } from "@hashgraph/sdk";

async function main(){

    // Setup Client 
    let client = new Connection().client;     

    // Add Keys for Multisig (based on 3 accounts)
    const privateKey1 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');
    const privateKey2 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');
    const privateKey3 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');

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

    //Sign the transaction with the old key and new key(s)
    const SignedByFirstTx = await transaction.sign(privateKey1);
    const SignedBySecondTx = await SignedByFirstTx.sign(privateKey2);
    const SignedByThirdTx = await SignedBySecondTx.sign(privateKey3);

    // Sign the transaction with our client
    const txResponse = await SignedByThirdTx.execute(client);

    // Request the receipt of the transaction (so we can get the Topic Id we've created)
    const receipt = await txResponse.getReceipt(client);

    // Get the Token ID
    const tokenId = receipt.tokenId;

    // Output New Token 
    console.log("The new token ID is " + tokenId);
}

main();