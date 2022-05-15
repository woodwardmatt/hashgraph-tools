// Import classes etc.
import { Connection } from "./modules/connection.js";
import { AccountId, PrivateKey, TokenBurnTransaction, TokenId, TokenInfoQuery } from "@hashgraph/sdk";

// ******* START - EDIT ZONE (Only make changes below here) ********
let tokenId = "0.0.34812890";
//let serials = [];
let serials = [1,5,6,10];
let all_serials = false;
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

        //Cater for 1-based (not zero-based) serial numbers
        tokenSupply += 1;

        //If all serials, iterate over 1 to Supply value and all to the serials array
        for (let index = 1; index < tokenSupply; index++) {

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