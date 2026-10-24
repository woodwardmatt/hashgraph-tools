// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { Mirror } from "./modules/mirror.js";
import { TokenBurnTransaction, TokenId, TokenInfoQuery } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********

/*
    Use cases:
    1. Burn all tokens for a given Token ID (Recommendation: Leave serial_start as 1).
    2. Burn all tokens for a given Token ID from a given serial number onwards (Recommendation: Define the serial_start variable).
    3. Burn specific serials numbers for a given Token ID (Recommendation: Define the numbers in the serials array variable, and set all_serials to false).

    How it works:
    Only NFTs held by the token's treasury account can be burnt. The script asks the mirror node which serials
    the treasury currently holds, and only burns those (so burnt, transferred, or never minted serials are skipped).
    Serials are burnt highest first, in batches of batch_size.

    BEHAVIOUR CHANGE (previous versions burnt a single batch per run):
    The script now continues automatically, batch after batch, until every matching serial is burnt.
    Use max_batches to limit how many batches are burnt per run (e.g. max_batches = 1 burns one batch then stops,
    as previous versions did). Re-running the script picks up the remaining serials automatically.

    Defaults:
    Burn all serials held by the treasury for Token ID "0.0.0000000", in batches of 10, with no batch limit.
*/

// Define the Token ID for which we will burn serials
let tokenId = "0.0.0000000";

// Define specific serial numbers to burn when all_serials is false, or leave blank for when all serials is true
let serials = []; // Or let serials = [1,5,6,10];

// Define the start point for the burn operation (e.g. from serial #1 onward, or a fixed number onwards)
let serial_start = 1; // Or let serial_start = 11;

// Define if we are burning all NFTs in the collection
let all_serials = true; // Or let all_serials = false;

// Work with a batch size for burning (Hedera allows a maximum of 10 serials per burn transaction)
let batch_size = 10;

// Limit the number of batches burnt per run (0 = no limit, burn every matching serial)
let max_batches = 0; // Or let max_batches = 1; (one batch per run)

// ******* END - EDIT ZONE (Only make changes above here) ********

// Hedera limit for the number of serials in a single burn transaction
const MAX_BATCH_SIZE = 10;

// Entry point for script execution
async function main(){

    // SETUP CLIENTS
    let client = new Connection().client;

    //Get Token Info (for the supply, and the treasury account that holds burnable NFTs)
    let tokenInfo = await new TokenInfoQuery()
                        .setTokenId(tokenId)
                        .execute(client);

    //Log the total supply
    console.log("Total Supply (pre Burn): " + tokenInfo.totalSupply.toString());

    //Get the serials currently held by the treasury (only these can be burnt)
    const treasuryId = tokenInfo.treasuryAccountId.toString();
    const treasurySerials = await Mirror.getSerialsHeldBy(tokenId, treasuryId);
    console.log("Serials held by treasury " + treasuryId + ": " + treasurySerials.length);

    //Work out which serials we'll be burning
    let toBurn = [];

    if(all_serials){

        //All treasury serials from the start point onwards
        toBurn = treasurySerials.filter((serial) => serial >= serial_start);

    }else{

        //Only the requested serials which the treasury actually holds
        toBurn = treasurySerials.filter((serial) => serials.includes(serial));

        //Let us know about any requested serials that will be skipped
        const skipped = serials.filter((serial) => !treasurySerials.includes(serial));
        if(skipped.length > 0) console.log("Skipping serials not held by the treasury (burnt, transferred or never minted): " + skipped.join(", "));
    }

    //Verify we have something to burn
    if(toBurn.length === 0){
        console.log("No serials to burn.");
        return;
    }

    //Keep the batch size within Hedera's limit
    const size = (batch_size > 0 && batch_size <= MAX_BATCH_SIZE) ? batch_size : MAX_BATCH_SIZE;

    //Apply the batch limit for this run (if set)
    const remaining = toBurn.length;
    if(max_batches > 0) toBurn = toBurn.slice(0, max_batches * size);

    //Log Serials we'll be burning
    console.log("Token Serials to burn (" + toBurn.length + ", highest first, in batches of " + size + "):");
    console.log(toBurn);

    //Let us know if the batch limit leaves serials for a later run
    if(toBurn.length < remaining) console.log("Batch limit of " + max_batches + " reached - " + (remaining - toBurn.length) + " serials will remain. Re-run the script to continue.");

    //Get the supply key once (used to sign every batch)
    const supplyKey = Keys.fromEnv("SUPPLY_KEY");

    //Burn each batch in turn
    for (let index = 0; index < toBurn.length; index += size) {

        const batch = toBurn.slice(index, index + size);

        //Burn tokens and freeze the unsigned transaction for manual signing
        let transaction = new TokenBurnTransaction()
                            .setTokenId(TokenId.fromString(tokenId))
                            .setSerials(batch)
                            .freezeWith(client);

        //Sign with the supply private key of the token
        const signTx = await transaction.sign(supplyKey);

        //Submit the transaction to a Hedera network
        let txResponse = await signTx.execute(client);

        //Request the receipt of the transaction
        let receipt = await txResponse.getReceipt(client);

        //Log the outcome of the batch
        console.log("Burnt serials [" + batch.join(", ") + "] - status " + receipt.status.toString());
    }

    //Re-fetch Token Info (as supply has changed)
    tokenInfo = await new TokenInfoQuery()
                        .setTokenId(tokenId)
                        .execute(client);

    //Log the total supply after burning
    console.log("Total Supply (after Burn): " + tokenInfo.totalSupply.toString());

}

//Execute Script (& Log Errors), then exit to prevent the terminal locking upon completion
main()
    .then(() => process.exit(0))
    .catch((error) => { console.log(error); process.exit(1); });
