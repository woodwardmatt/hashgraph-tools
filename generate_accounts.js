// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { AccountCreateTransaction, Hbar } from "@hashgraph/sdk";

async function main(){

    // Setup Client 
    let client = new Connection().client;    

    //List of accounts we want to generate
    let accounts = [
        {
            "name" : "EVM Account",
            "evm" : true
        },
        {
            "name" : "Non-EVM Account",
            "evm" : false
        },        
    ];

    //Fair Warning
    console.log('*****************************************');
    console.log('* Save this information somewhere safe! *');
    console.log('*****************************************');

    //Iterate over the array and generate accounts for each item
    asyncForEach(accounts, async (account) => {
        
        //Title
        console.log('*****************************************');
        console.log('* Information for: ' + account["name"]);
        console.log('*****************************************');

        //Generate New Keys for the Account (we need the public key before creating the account)
        let credentials = Keys.generateKeys(account["evm"]);
        const phrase = (await credentials).phrase;
        const publicKey = (await credentials).public;
        const privateKey = (await credentials).private;
        const EVMpublicKey = (await credentials).EVMpublic;
        const EVMprivateKey = (await credentials).EVMprivate;
        const EVMAddress = (await credentials).EVMAddress;

        //Create the Account (with 100 hbars)
        const transaction = new AccountCreateTransaction()
            .setKey(publicKey)
            .setInitialBalance(new Hbar(100));

        //Sign the transaction with our client
        const txResponse = await transaction.execute(client);

        //Request the receipt of the transaction (so we can get the account Id we've created)
        const receipt = await txResponse.getReceipt(client);

        //Get the Account ID
        const accountId = receipt.accountId;

        //Credentials - Only logged here, store safely please.
        console.log("Account ID is " + accountId);
        console.log('Mnemonic phrase: ' + phrase);
        console.log('Private key: ' + privateKey);
        console.log('Public key: ' + publicKey); 

        //Output EVM information for EVM Keys
        if(account["evm"]){
            console.log('Public EVM key: ' + EVMpublicKey); 
            console.log('Private EVM key: ' + EVMprivateKey); 
            console.log('EVM Address: ' + EVMAddress);  
        }        
        
        //Add space between key outputs
        console.log('');         
    });

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

main();