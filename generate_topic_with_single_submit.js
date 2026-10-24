// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { TopicCreateTransaction,KeyList,PrivateKey, PublicKey } from "@hashgraph/sdk";

async function main(){

    // Setup Client 
    let client = new Connection().client;

    //Generate New Key Pair (for Admin Key)
    let credentials = Keys.generateKeys();
    const phrase = (await credentials).phrase;
    const publicKey = (await credentials).public;
    const privateKey = (await credentials).private;
    const EVMpublicKey = (await credentials).EVMpublic;
    const EVMprivateKey = (await credentials).EVMprivate;
    const EVMAddress = (await credentials).EVMAddress;

    //Fair Warning
    console.log('*****************************************');
    console.log('* Save this information somewhere safe! *');
    console.log('*****************************************');

    //Credentials - Only logged here, store safely please.
    console.log('New mnemonic phrase: ' + phrase);
    console.log('New private key: ' + privateKey);
    console.log('New public key: ' + publicKey); 
    console.log('New public EVM key: ' + EVMpublicKey); 
    console.log('New private EVM key: ' + EVMprivateKey); 
    console.log('New EVM Address: ' + EVMAddress);                         
    console.log('');      

    // Add Key
    const submitKey = PublicKey.fromString('<Insert DER-Encoded Public Key>');
 
    // Create the Topic
    let transaction = new TopicCreateTransaction()
        .setAdminKey(publicKey)
        .setSubmitKey(submitKey)
        .freezeWith(client);

    //Sign the transaction with the admin key
    const SignedByAdmin = await transaction.sign(privateKey);

    // Sign the transaction with our client
    const txResponse = await SignedByAdmin.execute(client);

    // Request the receipt of the transaction (so we can get the Topic Id we've created)
    const receipt = await txResponse.getReceipt(client);

    // Get the Topic ID
    const topicId = receipt.topicId;

    // Output New Topic 
    console.log("The new topic ID is " + topicId);
}

main();