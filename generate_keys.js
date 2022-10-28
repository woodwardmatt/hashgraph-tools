// Import classes etc.
import { Keys } from "./modules/keys.js";

async function main(){

    //List of keys we want to generate
    let keys = ['Admin Key', 'Supply Key', 'Pause Key', 'Freeze Key', 'Wipe Key'];

    //Fair Warning
    console.log('*****************************************');
    console.log('* Save this information somewhere safe! *');
    console.log('*****************************************');

    //Iterate over the array and generate keys for each item
    asyncForEach(keys, async (key) => {
        
        //Title
        console.log('*****************************************');
        console.log('* Information for: ' + key);
        console.log('*****************************************');

        //Generate New Key Pair
        let credentials = Keys.generateKeys();
        const phrase = (await credentials).phrase;
        const publicKey = (await credentials).public;
        const privateKey = (await credentials).private;
        const EVMpublicKey = (await credentials).EVMpublic;
        const EVMprivateKey = (await credentials).EVMprivate;
        const EVMAddress = (await credentials).EVMAddress;

        //Credentials - Only logged here, store safely please.
        console.log('New mnemonic phrase: ' + phrase);
        console.log('New private key: ' + privateKey);
        console.log('New public key: ' + publicKey); 
        console.log('New public EVM key: ' + EVMpublicKey); 
        console.log('New private EVM key: ' + EVMprivateKey); 
        console.log('New EVM Address: ' + EVMAddress);                         
        console.log('');         
    });

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

main();