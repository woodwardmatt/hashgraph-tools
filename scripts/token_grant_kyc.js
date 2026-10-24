// Import classes etc.
import { Connection } from "../modules/connection.js";
import { Keys } from "../modules/keys.js";
import { TokenGrantKycTransaction } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********
let tokenId = "0.0.0000000";
let accountId = "0.0.00000000";
// Note: The KYC key is read from KYC_KEY in your env file
// ******* END - EDIT ZONE (Only make changes above here) ********

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Enable KYC flag on account and freeze the transaction for manual signing
    const transaction = await new TokenGrantKycTransaction()
        .setAccountId(accountId)
        .setTokenId(tokenId)
        .freezeWith(client);

    //Sign with the kyc private key of the token
    const signTx = await transaction.sign(Keys.fromEnv("KYC_KEY"));

    //Submit the transaction to a Hedera network    
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
        
    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " + transactionStatus.toString());
}

//Execute Script (& Log Errors), then exit to prevent the terminal locking upon completion
main()
    .then(() => process.exit(0))
    .catch((error) => { console.log(error); process.exit(1); });
