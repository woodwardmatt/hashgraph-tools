// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { TokenUpdateTransaction } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********
let tokenId = "0.0.34812767";
// ******* END - EDIT ZONE (Only make changes above here) ********

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Create the transaction and freeze for manual signing
    const transaction = await new TokenUpdateTransaction()
        .setTokenId(tokenId)
        .setSupplyKey(Keys.fromEnv("SUPPLY_KEY"))
        .setPauseKey(Keys.fromEnv("PAUSE_KEY"))
        .setFreezeKey(Keys.fromEnv("FREEZE_KEY"))
        .setWipeKey(Keys.fromEnv("WIPE_KEY"))
        .freezeWith(client);

    //Sign the transaction with the admin key
    const signTx = await transaction.sign(Keys.fromEnv("ADMIN_KEY"));

    //Submit the signed transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status.toString();

    console.log("The transaction consensus status is " + transactionStatus);

}

//Execute Script (& Log Errors), then exit to prevent the terminal locking upon completion
main()
    .then(() => process.exit(0))
    .catch((error) => { console.log(error); process.exit(1); });
