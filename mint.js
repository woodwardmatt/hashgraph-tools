// Read Environmental variables from .env file
require("dotenv").config();

// Import classes etc.
const {Client, AccountId, PrivateKey, Hbar, CustomRoyaltyFee, CustomFixedFee, TokenCreateTransaction, TokenType, TokenSupplyType, TokenInfoQuery, TokenMintTransaction, TokenBurnTransaction, AccountUpdateTransaction, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery} = require("@hashgraph/sdk");
const {NFTStorage, File} = require("nft.storage");
const fs = require("fs");

// Configure NFT.Storage client
const storageclient = new NFTStorage({ token: process.env.STORAGE_KEY });

// ******* START - EDIT ZONE (Only make changes below here) ********

// NFT Media location - Where your NFT resources are stored locally
const mediaPath = './images/'; 

// Common NFT metadata
const creator = 'Provide your creator name here';             // Enter Creator name here e.g. AffirmationNFT (comma separated for multiple)
const collectionName = 'Provide your collection name here';   // Enter Parent Collection name here e.g Serie 1 - "I Am..."

// Expanding an existing collection? Put the Token ID in here (Serial number will continue automatically)
const existingCollectionId = '';

// The Maximum number of NFTs in the collection (when created)
const maxCollectionSupply = 10000;

//Define supply per NFT - Set this to the number of copies per NFT required
const supply = 1;

// Setup metadata for NFTs here
const nfts = [
                {
                    name: 'A second test token name',
                    description: 'A second test description to verify metadata structure and usage.',
                    image: 'test-2.png',
                    type: 'image/png',
                    properties:{"edition":{"set": 1,"drop": 1,"pack": 1}},
                    attributes:[{"trait_type": "smileType", "value": "largeGrin"},{"trait_type": "smileColor", "value": "yellow"}],
                },                
                // {
                //     name: '<Token Name>',
                //     description: '<Human readable description of the asset>',
                //     image: '<Put your local file name here e.g. test-2.png>',
                //     type: '<Mime-type of the file - e.g. image/png>',
                //     properties: {} or {//arbitrary json objects / arrays / strings / integers}      
                //     attributes: {} or {//arbitrary json objects / arrays / strings / integers} 
                // }
            ];

// Setup custom fees (can be left empty if not required) - 10 Maximum! (Ensure they exist & are valid)
const fees = [
                // {
                //     royalty: 1,
                //     fallback: 10,
                //     accountId: '0.0.26563930' 
                // },
                // {
                //     royalty: 2,
                //     fallback: 20,
                //     accountId: '0.0.26563933' 
                // },
                // {
                //     royalty: <percentage as a whole number>,
                //     fallback: <Fallback fee as a whole number>,
                //     accountId: '<Accoutn ID as a string>' 
                // }, 
];

// ******* END - EDIT ZONE (Only make changes above here) ********

//UTILITY FUNCTIONS - ASYNC FOREACH
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

// Entry point for script execution
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

    // SETUP ARRAY FOR CUSTOM FEES
    let nftCustomFees = await addCustomFees();

    // DEFINE NFT COLLECTION (Or SET COLLECTION TOKEN ID HERE & COMMENT OUT CREATE FUNCTION CALL)
    let collectionId = (existingCollectionId) ? existingCollectionId : await createNFTCollection(client, nftCustomFees);

    // CREATE NFTs IN COLLECTION
    await createNFTs(client, collectionId);
}

//ADD CUSTOM FEES (AS DEFINED IN FEES ABOVE)
async function addCustomFees(){

    //DECLARE LOCALS
    let customFees = [];

    // VERIFY IF WE HAVE CUSTOM FEES TO IMPLEMENT
    if(fees.length > 0){

        // FORCE CUSTOM FEES TO BE LIMITED TO 10 ENTRIES ONLY
        if(fees.length > 10){
            fees.length = 10;
        }

        // ADD ALL DEFINED CUSTOM FEES
        for (let index = 0; index < fees.length; index++) {
            const fee = fees[index];
            customFees.push(await createCustomFee(fee.royalty, fee.fallback, fee.accountId));
        }
    }

    //RETURN OUTPUT
    return customFees;
}

// FOR CREATING CUSTOM FEES
async function createCustomFee(royalty, fallback, accountId){

    try {

        // VERIFY IF WE ARE APPLYING A FALLBACK FEE
        if(fallback > 0){

            return await new CustomRoyaltyFee()
            .setNumerator(royalty)
            .setDenominator(100)
            .setFeeCollectorAccountId(AccountId.fromString(accountId))
            .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(fallback)));

        }else{

            return await new CustomRoyaltyFee()
            .setNumerator(royalty)
            .setDenominator(100)
            .setFeeCollectorAccountId(AccountId.fromString(accountId))
        }

    } catch (error) {
        throw new Error(
            "Custom Fee setup experienced an issue. Please ensure the accounts used exist and are valid." + '\n'
        );        
    }
}

// FOR CREATING PARENT COLLECTION FOR NFTS
async function createNFTCollection(client, nftCustomFees){

    // ENSURE WE HAVE REQUIRED INPUTS
    if(!client) return -1;

    try {

        // DECLARE LOCAL VARS
        let nftCreate;

        // VERIFY IF WE HAVE A CUSTOM FEE TO IMPLEMENT
        if(nftCustomFees.length !== 0){

            // CREATE NFT WITH CUSTOM FEE
            nftCreate = await new TokenCreateTransaction()
                .setTokenName(collectionName)
                .setTokenSymbol(collectionName)
                .setTokenType(TokenType.NonFungibleUnique)
                .setDecimals(0)                                             //Must be zero so NFTs are not fractional?
                .setInitialSupply(0)                                        //Must be zero so you can set unique metadata per NFT?
                .setTreasuryAccountId(process.env.TREASURY_ID)
                .setSupplyType(TokenSupplyType.Finite)
                .setMaxSupply(maxCollectionSupply)
                .setCustomFees(nftCustomFees)
                .setAdminKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setSupplyKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setPauseKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setFreezeKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setWipeKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .freezeWith(client)
                .sign(PrivateKey.fromString(process.env.TREASURY_KEY));

        }else{

            // CREATE NFT WITHOUT FEE
            nftCreate = await new TokenCreateTransaction()
                .setTokenName(collectionName)
                .setTokenSymbol(collectionName)
                .setTokenType(TokenType.NonFungibleUnique)
                .setDecimals(0)                                             //Must be zero so NFTs are not fractional?
                .setInitialSupply(0)                                        //Must be zero so you can set unique metadata per NFT?
                .setTreasuryAccountId(process.env.TREASURY_ID)
                .setSupplyType(TokenSupplyType.Finite)
                .setMaxSupply(maxCollectionSupply)
                .setAdminKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setSupplyKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setPauseKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setFreezeKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setWipeKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
                .freezeWith(client)
                .sign(PrivateKey.fromString(process.env.TREASURY_KEY));
        }

        // SIGN, SUBMIT TRANSACTION & GET RECEIPT FOR NFT
        let nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(process.env.OPERATOR_KEY));
        let nftCreateSubmit = await nftCreateTxSign.execute(client);
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);
        let tokenId = nftCreateRx.tokenId;   
        
        console.log('Created NFT with Token ID: ' + tokenId.toString() + ' - fee information as follows:\n');

        // TOKEN QUERY TO CHECK THAT THE CUSTOM FEE SCHEDULE IS ASSOCIATED WITH NFT
        var tokenInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);

        // VERIFY WE HAVE CUSTOM FEES TO DISPLAY
        if(tokenInfo.customFees.length > 0){
            tokenInfo.customFees.forEach(customFee => {
                console.table(customFee);
            });
        }else{
            console.log('No custom fees configured.\n');
        }

        //RETURN COLLECTION's TOKEN ID
        return tokenId.toString();        
        
    } catch (error) {

        console.log('An error creating the collection: ' + error + '\n');
    }

    //NEGATIVE FALL THROUGH
    return -1;
}

// FOR UPLOADING MEDIA TO IPFS (VIA NFT.STORAGE)
async function storeNFTAssets(nft){

    const metadata = await storageclient.store({
        name: nft.name,
        description: nft.description,
        creator: creator,        
        image: new File(
          [await fs.promises.readFile(mediaPath + nft.image)],
          nft.image,
          { type: nft.type }
        ),
        type: nft.type,
        properties: nft.properties,
        attributes: nft.attributes,
      })

      //console.log(metadata.ipnft)
      console.log('IPFS URL for the metadata:' + metadata.url + '\n');

      return metadata;
}

// CREATE NFTF DEFINED (AT THE TOP OF THE SCRIPT)
async function createNFTs(client, collectionId){

    try {

        //VERIFY WE HAVE THE REQUIRED ID
        if(collectionId !== '' && collectionId !== -1){

            // CREATE NFTS IN COLLECTION
            asyncForEach(nfts, async (nft) => {

                // CREATE METADATA (INCL. FILE UPLOAD TO IPFS)
                let metadata = await storeNFTAssets(nft);

                // CREATE SUPPLY FOR NFTS (i.e. DUPLICATES)
                for (let index = 0; index < supply; index++) {

                    // MINT TOKEN USING METADATA & COLLECTION ID
                    tokenReceipt = await mintToken(metadata, client, collectionId);
                }  
            })

        }else{

            console.log('Collection ID is not present. minting aborted.\n');

            //DENOTE FAILED MINTING
            return false;
        } 
        
        //DENOTE SUCCESSFUL MINTING
        return true;        
        
    } catch (error) {

        //LOG ERROR
        console.log('An error creating the nft: ' + error + '\n');

        //DENOTE FAILED MINTING
        return false;        
    }
}

// MINT TOKEN
async function mintToken(metadata, client, tokenId) {

    try {

        mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadata.url)])
        .freezeWith(client);
    
        let mintTxSign = await mintTx.sign(PrivateKey.fromString(process.env.OPERATOR_KEY));
        let mintTxSubmit = await mintTxSign.execute(client);
        let mintRx = await mintTxSubmit.getReceipt(client);

        console.log('TOKEN MINTED WITH SERIAL: ' + mintRx.serials.toString() + '\n')

        //RETURN TOKEN RECEIPT
        return mintRx;  

    } catch (error) {

        //LOG ERROR
        console.log('An error minting the nft: ' + error + '\n'); 
        
        //DENOTE FAILED MINTING
        return -1;
    }
}

main().catch((error)=>{console.log(error);})
