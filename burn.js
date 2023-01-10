// Import classes etc.
import { Connection } from "./modules/connection.js";
import { AccountId, PrivateKey, TokenBurnTransaction, TokenId, TokenInfoQuery } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********

/*
    Use cases: 
    1. Burn all tokens for a given Token ID (Recommendation: Define batch_size as less than the current rate limit).
    2. Burn all tokens for a given Token ID from a given serial number onwards (Recommendation: Define the serial_start, and batch_size variables).
    3. Burn specific serials numbers for a given Token ID (Recommendation: Define the numbers in the serials array variable).

    Defaults: 
    Burn all serials for Token ID "0.0.0000000", starting at serial #1 using a batch size of 10. 
    Expected result: serials 1 to 10 will be burnt. Automated continuation is currently not supported - you'll need to update serial_start and re-run for the next batch.
*/

// Define the Token ID for which we will burn serials
let tokenId = "0.0.0000000";

// Define specific serial numbers to burn when all_serials is false, or leave blank for when all serials is true
let serials = []; // Or let serials = [1,5,6,10];

// Define the start point for the burn operation (e.g. from serial #1 onward, or a fixed number onwards)
let serial_start = 1; // Or let serial_start = 11;

// Define if we are burning all NFTs in the collection
let all_serials = true; // Or let all_serials = false;

// Work with a batch size for burning (e.g. only burn 10 NFTs at a time based on current rate limiting)
let batch_size = 10;

// ******* END - EDIT ZONE (Only make changes above here) ********

// Entry point for script execution
async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Get Token Info
    let tokenInfo = new TokenInfoQuery()
                        .setTokenId(tokenId); 
          
    //Get Token Supply (and parse as int)
    var tokenSupply = parseInt((await tokenInfo.execute(client)).totalSupply);

    //Log the total supply
    console.log("Total Supply (pre Burn): " + tokenSupply);

    //Verify if we are burning all serials (or just specified numbers)
    if(all_serials){

        //Setup variable for burn loop
        let loop = 0;

        //Verify if we have a batch size we are working with for the burn
        if(batch_size > 0){

            //Loop size is based on batch size plus any offset from the start point
            loop = batch_size + serial_start;

        }else{

            //Loop size based on supply
            loop = tokenSupply;
        }

        //Cater for 1-based (not zero-based) serial numbers
        if (serial_start == 1) loop += 1;

        //If all serials, iterate over 1 to Supply value and all to the serials array
        for (let index = serial_start; index < loop; index++) {

            //Push value to serials array
            serials.push(index);
        }   
    }

    //Log Serials we'll be burning
    console.log("Token Serials to burn:");
    console.log(serials);

    //Burn tokens and freeze the unsigned transaction for manual signing
    let transaction = await new TokenBurnTransaction()
                        .setTokenId(TokenId.fromString(tokenId))
                        .setSerials(serials)
                        .freezeWith(client);

    //Sign with the supply private key of the token 
    const signTx = await transaction.sign(PrivateKey.fromString(process.env.SUPPLY_KEY));

    //Submit the transaction to a Hedera network
    let txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);
        
    //Get the transaction consensus status
    let transactionStatus = receipt.status;

    //Log the outcome of the transaction
    console.log("The transaction consensus status " + transactionStatus.toString());

    //Get Token Info (again! as new transaction)
    tokenInfo = new TokenInfoQuery()
                        .setTokenId(tokenId); 

    //Re-fetch Token Supply (and parse as int)
    tokenSupply = parseInt((await tokenInfo.execute(client)).totalSupply);

    //Log the total supply after burning
    console.log("Total Supply (after Burn): " + tokenSupply);    

}

//Execute Script (& Log Errors)
main().catch((error)=>{console.log(error);})