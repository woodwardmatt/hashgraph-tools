import { Mnemonic, PrivateKey } from "@hashgraph/sdk";

export class Keys{

    constructor(){};

    //Parse a private key string (ECDSA or ED25519)
    // - DER-encoded keys (e.g. 3030... / 302e...) carry their own type, so are detected automatically
    // - Raw hex keys (with or without 0x) are ambiguous, so use the type supplied (ECDSA by default)
    static parsePrivateKey(text, type = "ECDSA"){

        //Tidy up the input
        const key = String(text ?? "").trim();
        if(!key) throw new Error("parsePrivateKey(): No private key was provided.");

        //DER-encoded keys (longer than a 64 character raw key, which could also start with "30")
        if(key.startsWith("30") && key.length > 64) return PrivateKey.fromStringDer(key);

        //Raw hex keys
        switch(String(type).trim().toUpperCase()){
            case "ECDSA":
            case "SECP256K1":
                return PrivateKey.fromStringECDSA(key);
            case "ED25519":
                return PrivateKey.fromStringED25519(key);
            default:
                throw new Error("parsePrivateKey(): Unknown key type '" + type + "' (use ECDSA or ED25519).");
        }
    }

    //Read a private key from the env file by name (e.g. "SUPPLY_KEY")
    //An optional <NAME>_TYPE entry (e.g. SUPPLY_KEY_TYPE=ED25519) sets the type of raw hex keys
    static fromEnv(name){

        //Verify the key has been provided
        const value = process.env[name];
        if(!value || !value.trim()) throw new Error("Keys.fromEnv(): " + name + " is missing from your env file.");

        try {
            const type = process.env[name + "_TYPE"];
            const key = this.parsePrivateKey(value, type || "ECDSA");

            //DER keys carry their own type, so flag any <NAME>_TYPE entry that doesn't match it
            if(type){
                const expected = (String(type).trim().toUpperCase() === "ED25519") ? "ED25519" : "secp256k1";
                if(key.type !== expected) console.warn("Keys.fromEnv(): " + name + "_TYPE is " + type + ", but " + name + " is a DER-encoded " + (key.type === "secp256k1" ? "ECDSA" : key.type) + " key. Using " + (key.type === "secp256k1" ? "ECDSA" : key.type) + " (you can remove " + name + "_TYPE).");
            }

            return key;
        } catch (error) {
            throw new Error("Keys.fromEnv(): " + name + " could not be parsed - " + error.message);
        }
    }

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