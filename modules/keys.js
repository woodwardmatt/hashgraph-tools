import { Mnemonic } from "@hashgraph/sdk";

export class Keys{

    constructor(){};

    static async generateKeys(){

        //Generate a 24-word mnemonic
        const newMnemonic = await Mnemonic.generate();
    
        //Create new keys
        const newAccountPrivateKey = await newMnemonic.toPrivateKey(); 
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
    
        //Output keys
        return {
            phrase: newMnemonic,
            private: newAccountPrivateKey,
            public: newAccountPublicKey
        };
    }

}