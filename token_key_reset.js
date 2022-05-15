// Import classes etc.
import { Connection } from "./modules/connection.js";
import { PrivateKey, TokenUpdateTransaction } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********
let tokenId = "0.0.34812767";
// ******* END - EDIT ZONE (Only make changes above here) ********

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Create the transaction and freeze for manual signing
    const transaction = await new TokenUpdateTransaction()
        .setTokenId(tokenId)
        .setSupplyKey(PrivateKey.fromString(process.env.SUPPLY_KEY))
        .setPauseKey(PrivateKey.fromString(process.env.PAUSE_KEY))
        .setFreezeKey(PrivateKey.fromString(process.env.FREEZE_KEY))
        .setWipeKey(PrivateKey.fromString(process.env.WIPE_KEY))
        .freezeWith(client);

    //Sign the transaction with the admin key
    const signTx = await transaction.sign(PrivateKey.fromString(process.env.ADMIN_KEY));

    //Submit the signed transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status.toString();

    console.log("The transaction consensus status is " + transactionStatus);

}

main();