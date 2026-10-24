import { Client, AccountId } from "@hashgraph/sdk";
import { Keys } from "./keys.js";

export class Connection{

    constructor(){

        //VERIFY THE REQUIRED ENV VARIABLES ARE PRESENT
        if(!process.env.HEDERA_NETWORK || !process.env.OPERATOR_ID || !process.env.OPERATOR_KEY){
            throw new Error(
                "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required."
            );
        }

        //SETUP CLIENT FOR THE NAMED NETWORK (ECDSA or ED25519 operator key)
        this.client = Client.forName(process.env.HEDERA_NETWORK)
        .setOperator(
            AccountId.fromString(process.env.OPERATOR_ID),
            Keys.fromEnv("OPERATOR_KEY")
        );

        //VERIFY IF WERE USING A CUSTOM MIRROR NODE
        if(process.env.HEDERA_MIRROR_ENDPOINT) this.client.setMirrorNetwork(process.env.HEDERA_MIRROR_ENDPOINT);
    }
}
