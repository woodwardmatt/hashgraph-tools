require("dotenv").config();

const{Client, AccountId, PrivateKey, AccountUpdateTransaction, Hbar, Mnemonic} = require("@hashgraph/sdk");

async function main(){

    //SETUP SDK CLIENT
    let client;

    try {
        client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
            AccountId.fromString(process.env.OPERATOR_ID),
            PrivateKey.fromString(process.env.OPERATOR_KEY)
        );
    } catch {
        throw new Error(
            "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required." + '\n'
        );
    }

    //Set the max transaction fee the client is willing to pay to 2 hbars
    client.setMaxTransactionFee(new Hbar(2));

    //Setup Account for Updating
    const editAccount = AccountId.fromString(process.env.ACCOUNT_ID);
    const editKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

    //Generate New Key Pair
    var keys = generateKeys();
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

async function generateKeys(){

    //Generate a 24-word mnemonic
    const newMnemonic = await Mnemonic.generate();

    //Create new keys
    const newAccountPrivateKey = await newMnemonic.toPrivateKey(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Output keys
    return keys = {
        phrase: newMnemonic,
        private: newAccountPrivateKey,
        public: newAccountPublicKey
    };
}

main();