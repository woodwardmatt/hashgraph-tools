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

    // Add Keys for Multisig (based on 3 accounts)
    const publicKey1 = PublicKey.fromString('<Insert DER-Ecndoed Public Key>');
    const publicKey2 = PublicKey.fromString('<Insert DER-Ecndoed Public Key>');
    const publicKey3 = PublicKey.fromString('<Insert DER-Ecndoed Public Key>');

    // Create a `KeyList` that represents a 1 of 3 multisig threshold
    const multisigPublicKeys = [publicKey1, publicKey2, publicKey3];
    const multisigKeyList = new KeyList(multisigPublicKeys, 1);

    //Log Keys (**Only visual output at this stage**)
    console.log('These are your new credentials...');
    console.log('Multisig Keylist ' + multisigKeyList.toString());    
        
    // Create the Topic
    let transaction = new TopicCreateTransaction()
        .setAdminKey(publicKey)
        .setSubmitKey(multisigKeyList)
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