//Configure imports / dependencies
import axios from "axios"
import FormData from "form-data"
import fs from "fs";

// FOR UPLOADING MEDIA TO IPFS (VIA PINATA)
export class Storage{

    constructor(){};

    static async storeAssets(creator, mediaPath, nft, serial = 0){

        //Setup prefix variable for image name
        let prefix = "";

        //Verify we want to pre-pend an incremental number
        if(serial > 0){

            //Convert int to string
            prefix = serial.toString();;

            //Pad string with leading zeros
            prefix = String(prefix).padStart(2, '0');
        }

        try {

            //Read in file required to filestream variable
            const file = fs.createReadStream(mediaPath + prefix + nft.image);

            //Build metadata for pinata metadata (not NFT metadata)
            var metadata = {
                name: nft.image,
            }

            //Store file on Pinata
            var cid = await this.storeFile(file, metadata)

            console.log("Pinata File CID : " + cid)

            //Build Metadata - Ref - HIP 412: https://github.com/hashgraph/hedera-improvement-proposal/blob/master/HIP/hip-412.md
            metadata = {
                pinataContent: {
                    "name": nft.name,
                    "creator": creator,        
                    "description": nft.description,
                    "image": "ipfs://" + cid,
                    "type": nft.type,
                    "properties" : nft.properties,
                    "attributes" : nft.attributes,
                    "format": "opensea"
                },
                pinataMetadata: {
                  name: "metadata.json"
                }
            }

            //Store metadata on Pinata
            cid = await this.storeJSON(metadata)

            console.log("Pinata Metadata CID : " + cid)

            //Return NFT metadata URL
            return "ipfs://" + cid;

        } catch (error) {
            console.log(error)
        }
    }

    static async storeJSON(metadata){

        try {

            //Convert to Json
            var data = JSON.stringify(metadata);            

            //Create post request to Pinata
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                  },
                }
            );

            //Output CID (Note: No leading IPFS://)
            return res.data.IpfsHash;
            
        } catch (error) {
            console.log(error)
        }
    }

    static async storeFile(file, metadata){

        try {
            
            //Setup new form data variable to post to Pinata
            const formData = new FormData();

            //Append File to Form Data (for posting)
            formData.append("file", file);

            //Build metadata for pinata
            const pinataMetadata = JSON.stringify(metadata);

            //Append metadata to Form Data
            formData.append("pinataMetadata", pinataMetadata);

            //Configure Pinata Options
            const pinataOptions = JSON.stringify({
                cidVersion: 1,
            });

            //Append options to Form Data
            formData.append("pinataOptions", pinataOptions);

            //Create post request to Pinata
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                  },
                }
            );

            //Output CID (Note: No leading IPFS://)
            return res.data.IpfsHash;

        } catch (error) {
            console.log(error)
        }
    }
}