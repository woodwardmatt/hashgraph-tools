// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { AccountId, PrivateKey, AccountUpdateTransaction, Hbar, Mnemonic } from "@hashgraph/sdk";

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Set the max transaction fee the client is willing to pay to 2 hbars
    client.setMaxTransactionFee(new Hbar(2));

    //Setup Account for Updating
    const editAccount = AccountId.fromString(process.env.ACCOUNT_ID);
    const editKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

    //Generate New Key Pair
    let keys = Keys.generateKeys();
    const phrase = (await keys).phrase;
    const publicKey = (await keys).public;
    const privateKey = (await keys).private;

    //Log Keys (**Only visual output at this stage**)
    console.log('These are your new credentials...');
    console.log('New mnemonic phrase: ' + phrase);
    console.log('New private key: ' + privateKey);
    console.log('New public key: ' + publicKey);  

    //Create the transaction to update the key on the account
    const transaction = await new AccountUpdateTransaction()
        .setAccountId(editAccount)
        .setKey(privateKey)
        .freezeWith(client);

    //Sign the transaction with the old key and new key
    const signTx = await (await transaction.sign(editKey)).sign(privateKey);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    //Log Transaction Status
    console.log("The transaction consensus status is " + transactionStatus.toString());

}

main();