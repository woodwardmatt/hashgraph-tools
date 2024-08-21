// Import classes etc.
import { Connection } from "./modules/connection.js";
import { AccountId, PrivateKey, AccountUpdateTransaction, Hbar, KeyList } from "@hashgraph/sdk";

async function main(){

    // SETUP CLIENTS 
    let client = new Connection().client;

    //Set the max transaction fee the client is willing to pay to 2 hbars
    client.setDefaultMaxTransactionFee(new Hbar(2));

    //Setup Account for Updating
    const editAccount = AccountId.fromString(process.env.ACCOUNT_ID);
    const editKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY);

    // Log Account being updated
    console.log('This is the account being updated:');
    console.log(editAccount.toString());

    // Add Keys for Multisig (based on 3 accounts)
    const privateKey1 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');
    const privateKey2 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');
    const privateKey3 = PrivateKey.fromStringECDSA('<Insert HEX-encoded Private Key String Here>');

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