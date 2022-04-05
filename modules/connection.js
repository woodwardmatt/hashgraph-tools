import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

export class Connection{

    constructor(){

        try {

            //VERIFY IF WERE USING THE MIRROR NODES
            if(process.env.HEDERA_MIRROR_ENDPOINT){
                this.client = Client.forNetwork(process.env.HEDERA_NETWORK)
                .setOperator(
                    AccountId.fromString(process.env.OPERATOR_ID),
                    PrivateKey.fromString(process.env.OPERATOR_KEY))
                .setMirrorNetwork(process.env.HEDERA_MIRROR_ENDPOINT);
            }else{
                this.client = Client.forName(process.env.HEDERA_NETWORK)
                .setOperator(
                    AccountId.fromString(process.env.OPERATOR_ID),
                    PrivateKey.fromString(process.env.OPERATOR_KEY)
                );
            }

        } catch {
            throw new Error(
                "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required."
            );
        } 
    }
}