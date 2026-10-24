// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Keys } from "./modules/keys.js";
import { AccountId, AccountUpdateTransaction, Hbar, KeyList } from "@hashgraph/sdk";

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Set the max transaction fee the client is willing to pay to 2 hbars
    client.setDefaultMaxTransactionFee(new Hbar(2));

    //Setup Account for Updating
    const editAccount = AccountId.fromString(process.env.ACCOUNT_ID);
    const editKey = Keys.fromEnv("PRIVATE_KEY");

    // Log Account being updated
    console.log('This is the account being updated:');
    console.log(editAccount.toString());

    // Add Keys for Multisig (based on 3 accounts)
    // Note: DER keys are detected automatically. For raw hex ED25519 keys, change 'ECDSA' to 'ED25519'
    const privateKey1 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');
    const privateKey2 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');
    const privateKey3 = Keys.parsePrivateKey('<Insert Private Key Here (DER or hex)>', 'ECDSA');

    // Create a `KeyList` that represents a 3 of 3 multisig threshold
    const multisigPublicKeys = [(await privateKey1).publicKey, (await privateKey2).publicKey, (await privateKey3).publicKey];
    const multisigKeyList = new KeyList(multisigPublicKeys, 3);

    //Log Keys (**Only visual output at this stage**)
    console.log('These are your new credentials...');
    console.log('Multisig Keylist ' + multisigKeyList.toString());

    //Create the transaction to update the key on the account
    const transaction = await new AccountUpdateTransaction()
        .setAccountId(editAccount)
        .setKey(multisigKeyList)
        .freezeWith(client);

    //Sign the transaction with the old key and new key(s)
    const SignedByOriginalTx = await transaction.sign(editKey);
    const SignedByFirstTx = await SignedByOriginalTx.sign(privateKey1);
    const SignedBySecondTx = await SignedByFirstTx.sign(privateKey2);
    const SignedByThirdTx = await SignedBySecondTx.sign(privateKey3);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await SignedByThirdTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    //Log Transaction Status
    console.log("The transaction consensus status is " + transactionStatus.toString());

}

main();