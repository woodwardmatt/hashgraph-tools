// Configure required imports / dependencies
import { PinataSDK } from "pinata-web3";
import fs from "fs";

// Setup Pinata SDK Object
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL
})

// FOR UPLOADING MEDIA TO IPFS (VIA PINATA)
export class Storage{

    constructor(){};

    static async storeAssets(creator, mediaPath, nft, serial = 0){

        //Setup prefix variable for image name
        let prefix = "";

        //Verify we want to pre-pend an incremental number
        if(serial > 0){

            //Convert int to string
            prefix = serial.toString();

            //Pad string with leading zeros
            prefix = String(prefix).padStart(2, '0');
        }

        try {

            //Read in file required to buffer variable
            const blob = fs.readFileSync(mediaPath + prefix + nft.image);

            //Store file on Pinata
            var cid = await this.storeFile(blob, nft)

            //Debug output
            console.log("Pinata File CID : " + cid)

            //Build Metadata - Ref - HIP 412: https://github.com/hiero-ledger/hiero-improvement-proposals/blob/main/HIP/hip-412.md
            var metadata = {
                name: nft.name,
                creator: creator,        
                description: nft.description,
                image: "ipfs://" + cid,
                type: nft.type,
                properties: nft.properties,
                attributes: nft.attributes,
                format: "opensea"
            }

            //Store metadata on Pinata
            cid = await this.storeJSON(metadata)

            console.log("Pinata Metadata CID : " + cid)

            //Return NFT metadata URL
            return "ipfs://" + cid;

        } catch (error) {

            //Report the failure and return no metadata URL (so no NFT is minted)
            console.log('IPFS upload failed for ' + nft.image + ': ' + (error.message || error));
            return null;
        }
    }

    static async storeJSON(metadata){

        //Upload metadata to Pinata (errors are handled by storeAssets)
        const upload = await pinata.upload.json(metadata);

        //Output CID (Note: No leading IPFS://)
        return upload.IpfsHash;
    }

    static async storeFile(blob, nft){

        //Create file object to upload to Pinata
        const file = new File([blob], nft.image, { type: nft.type });

        //Upload file to Pinata (errors are handled by storeAssets)
        const upload = await pinata.upload.file(file);

        //Output CID (Note: No leading IPFS://)
        return upload.IpfsHash;
    }
}