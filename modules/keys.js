import { Mnemonic } from "@hashgraph/sdk";

export class Keys{

    constructor(){};

    static async generateKeys(isECDSA = true){

        //Generate a 24-word mnemonic
        const newMnemonic = await Mnemonic.generate();
    
        //Create new keys (ECDSA by default)
        const newAccountPrivateKey = (isECDSA) ? await newMnemonic.toStandardECDSAsecp256k1PrivateKey() : await newMnemonic.toStandardEd25519PrivateKey();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
    
        //Output keys (type specific)
        if (isECDSA) {

            //EVM Compatible ECDSA Output keys
            return {
                phrase: newMnemonic,
                private: newAccountPrivateKey,
                public: newAccountPublicKey,
                EVMprivate: '0x' + newAccountPrivateKey.toStringRaw(),
                EVMpublic: '0x' + newAccountPublicKey.toStringRaw(),
                EVMAddress: newAccountPublicKey.toEvmAddress()
            };

        }else{

            //Non-EVM Compatible ED25519 Output keys
            return {
                phrase: newMnemonic,
                private: newAccountPrivateKey,
                public: newAccountPublicKey
            };

        }


    }

}