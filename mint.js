// Import classes etc.
import { Connection } from "./modules/connection.js";
import { Storage } from "./modules/storage.js";
import { AccountId, PrivateKey, Hbar, CustomRoyaltyFee, CustomFixedFee, TokenCreateTransaction, TokenType, TokenSupplyType, TokenInfoQuery, TokenMintTransaction, TokenBurnTransaction, AccountUpdateTransaction, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery } from "@hashgraph/sdk";
import { error } from "console";

// ******* START - EDIT ZONE (Only make changes below here) ********

/*
    Use Case:
    1. Create a Token and mint a collection of unique NFTs to that token ID (Define required NFT metadata in the "nfts" array)
    2. Create a Token and mint a collection of duplicate NFTs (same image & meta data) to that token ID (Define the "supply" variable as greater than 1 to depict the number of duplicates).
    3. Create a Token and mint a collection of duplicate NFTs (different image, same meta data) to that token ID (Define the "autoSupply" and "autoSupplyStart" to depict the number of nfts). 
       Images should all be prefixed with their serial number (e.g. #001-file.png") in the "mediaPath" directory, and the corresponding image file in the "nft" meta should just be the suffix (e.g. "-file.png")
    4. Update an existing Token (by supplying the "existingCollectionId") with more NFTs (i.e. increase the supply) using any of the above variations.

    Default: 
    Create a new Token with a max supply of 10000, and mint a single NFT (no duplicates).
*/

// NFT Media location - Where your NFT resources are stored locally
const mediaPath = '/home/...<INSERT ABSOLUTE PATH HERE>.../images/';

// Common NFT metadata
const creator = 'Provide your creator name here';             // Enter Creator name here e.g. AffirmationNFT (comma separated for multiple)
const collectionName = 'Provide your collection name here';   // Enter Parent Collection name here e.g Serie 1 - "I Am..."

// Expanding an existing collection? Put the Token ID in here (Serial number will continue automatically)
const existingCollectionId = '';

// The Maximum number of NFTs in the collection (when created)
const maxCollectionSupply = 10000;

//Define supply per NFT - Set this to the number of copies per NFT required
const supply = 1;

//Define the automatic supply for NFT image variations with the same metadata
//Note: Using autoSupply will automatically prepend the serial number to the image path in the image folder
const autoSupply = 0; // Or const autoSupply = 50;

//Define the starting point for auto-increments (typically 1, but higher if restarting from errors)
const autoSupplyStart = 1;

// Setup metadata for NFTs here - This is for reference by the script only. 
// Note: 
// - "Additional" files, beyond the preview image, for each NFT should be uploaded to IPFS in advance and referenced here. (Future updates may remove this need.)
// - Metadata entries for additional files are optional
// - The opensea metadata format is currently used when the metadata is built (to allow for traits).
const nfts = [
                {
                    name: 'A test token name',
                    description: 'A test description to verify metadata structure and usage.',
                    image: 'test-2.png',
                    type: 'image/png',
                    properties:{
                        "edition":{"set": 1,"drop": 1,"pack": 1},
                        "files": [
                            {
                                "uri": "ipfs://bafkreic2mckm33lthlx7umwz3tc5i7neej3poiudit7ulp3s3jyyjrpmwu",
                                "type": "image/png",
                                "metadata": "ipfs://bafyreiexxkrytldqr3vaxrotsh5u37glm3q4mthdpcnstrbq7utigkfrse/metadata.json" //Optional
                            },
                            {
                                "uri": "ipfs://bafkreic2mckm33lthlx7umwz3tc5i7neej3poiudit7ulp3s3jyyjrpmwu",
                                "type": "image/png",
                                "metadata": "ipfs://bafyreiexxkrytldqr3vaxrotsh5u37glm3q4mthdpcnstrbq7utigkfrse/metadata.json" //Optional
                            }                            
                        ]
                    },
                    attributes:[
                        {
                            "trait_type": "smileType", 
                            "value": "largeGrin"
                        },
                        {
                            "trait_type": "smileColor", 
                            "value": "yellow"
                        }
                    ],
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
                //     accountId: '0.0.3617843' 
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

    // SETUP CLIENTS 
    let client = new Connection().client;

    // SETUP ARRAY FOR CUSTOM FEES
    let nftCustomFees = await addCustomFees();

    // DEFINE NFT COLLECTION (Or SET COLLECTION TOKEN ID HERE & COMMENT OUT CREATE FUNCTION CALL)
    let collectionId = (existingCollectionId) ? existingCollectionId : await createNFTCollection(client, nftCustomFees);

    // CREATE NFTs IN COLLECTION
    await createNFTs(client, collectionId);

    // EXIT SCRIPT
    process.exit();
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

    // ENSURE WE HAVE THE REQUIRED KEYS SETUP IN THE ENV FILE
    if(!process.env.ADMIN_KEY && !process.env.SUPPLY_KEY && !process.env.PAUSE_KEY && !process.env.FREEZE_KEY && !process.env.WIPE_KEY) throw(error("createNFTCollection(): SUPPLY_KEY in your env file must be provided where all other keys blank."));

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
                .setMaxTransactionFee(new Hbar(100))
                .setCustomFees(nftCustomFees);

                //Conditionally configure supply options where Supply Key is provided
                if(process.env.SUPPLY_KEY) nftCreate = nftCreate.setSupplyType(TokenSupplyType.Finite)
                if(process.env.SUPPLY_KEY) nftCreate = nftCreate.setMaxSupply(maxCollectionSupply)

                //Conditionally add keys where they are provided
                if(process.env.ADMIN_KEY) nftCreate = nftCreate.setAdminKey(PrivateKey.fromStringECDSA(process.env.ADMIN_KEY))
                if(process.env.SUPPLY_KEY) nftCreate = nftCreate.setSupplyKey(PrivateKey.fromStringECDSA(process.env.SUPPLY_KEY))
                if(process.env.PAUSE_KEY) nftCreate = nftCreate.setPauseKey(PrivateKey.fromStringECDSA(process.env.PAUSE_KEY))
                if(process.env.FREEZE_KEY) nftCreate = nftCreate.setFreezeKey(PrivateKey.fromStringECDSA(process.env.FREEZE_KEY))
                if(process.env.WIPE_KEY) nftCreate = nftCreate.setWipeKey(PrivateKey.fromStringECDSA(process.env.WIPE_KEY))

                //Freeze transaction from further modification
                nftCreate = nftCreate.freezeWith(client);

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
                .setMaxTransactionFee(new Hbar(100));

                //Conditionally add keys where they are provided
                if(process.env.ADMIN_KEY) nftCreate = nftCreate.setAdminKey(PrivateKey.fromStringECDSA(process.env.ADMIN_KEY))
                if(process.env.SUPPLY_KEY) nftCreate = nftCreate.setSupplyKey(PrivateKey.fromStringECDSA(process.env.SUPPLY_KEY))
                if(process.env.PAUSE_KEY) nftCreate = nftCreate.setPauseKey(PrivateKey.fromStringECDSA(process.env.PAUSE_KEY))
                if(process.env.FREEZE_KEY) nftCreate = nftCreate.setFreezeKey(PrivateKey.fromStringECDSA(process.env.FREEZE_KEY))
                if(process.env.WIPE_KEY) nftCreate = nftCreate.setWipeKey(PrivateKey.fromStringECDSA(process.env.WIPE_KEY))

                //Freeze transaction from further modification
                nftCreate = nftCreate.freezeWith(client);
        }

        // SIGN, SUBMIT TRANSACTION & GET RECEIPT FOR NFT
        let nftCreateTxSign = null

        //Verify if we need to sign with the admin key too (if supplied)
        if(process.env.ADMIN_KEY){
            nftCreateTxSign = await(await nftCreate.sign(PrivateKey.fromStringECDSA(process.env.ADMIN_KEY))).sign(PrivateKey.fromStringECDSA(process.env.TREASURY_KEY));
        }else{
            nftCreateTxSign = await nftCreate.sign(PrivateKey.fromStringECDSA(process.env.TREASURY_KEY));
        }

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

// CREATE NFTF DEFINED (AT THE TOP OF THE SCRIPT)
async function createNFTs(client, collectionId){

    try {

        //VERIFY WE HAVE THE REQUIRED ID
        if(collectionId !== '' && collectionId !== -1){

            // CREATE NFTS IN COLLECTION
            await asyncForEach(nfts, async (nft) => {

                //Verify if we are auto-incrementing 
                if(autoSupply > 0){

                    //Automatically increment 
                    for (let index = autoSupplyStart; index < (autoSupply + 1); index++){
  
                        // CREATE METADATA (INCL. FILE UPLOAD TO IPFS)
                        let metadata = await Storage.storeAssets(creator, mediaPath, nft, index)

                        // MINT TOKEN USING METADATA & COLLECTION ID
                        let tokenReceipt = await mintToken(metadata, client, collectionId);
                    }

                }else{

                    // CREATE METADATA (INCL. FILE UPLOAD TO IPFS)
                    let metadata = await Storage.storeAssets(creator, mediaPath, nft)

                    // CREATE SUPPLY FOR NFTS (i.e. DUPLICATES)
                    for (let index = 0; index < supply; index++) {

                        // MINT TOKEN USING METADATA & COLLECTION ID
                        let tokenReceipt = await mintToken(metadata, client, collectionId);
                    } 
                } 
            });

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

        let mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadata)])
        .freezeWith(client);
    
        let mintTxSign = await mintTx.sign(PrivateKey.fromStringECDSA(process.env.SUPPLY_KEY));
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

main().catch((error)=>{console.log(error);});