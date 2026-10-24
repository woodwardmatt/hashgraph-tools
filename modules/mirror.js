// FOR QUERYING THE HEDERA MIRROR NODE (REST API)
export class Mirror{

    constructor(){};

    //Public mirror node REST endpoints for each named network
    static endpoints = {
        mainnet: "https://mainnet-public.mirrornode.hedera.com",
        testnet: "https://testnet.mirrornode.hedera.com",
        previewnet: "https://previewnet.mirrornode.hedera.com"
    };

    //Get the REST endpoint (HEDERA_MIRROR_REST_URL in the env file overrides the public default)
    static baseUrl(){

        const url = process.env.HEDERA_MIRROR_REST_URL || this.endpoints[process.env.HEDERA_NETWORK];
        if(!url) throw new Error("Mirror.baseUrl(): No mirror node REST endpoint for network '" + process.env.HEDERA_NETWORK + "'. Set HEDERA_MIRROR_REST_URL in your env file.");

        //Remove any trailing slash
        return url.replace(/\/+$/, "");
    }

    //Get every (un-burnt) serial number of a token currently held by an account, highest first
    static async getSerialsHeldBy(tokenId, accountId){

        const base = this.baseUrl();
        let next = "/api/v1/tokens/" + tokenId + "/nfts?account.id=" + accountId + "&order=desc&limit=100";
        let serials = [];

        //Follow each page of results until there are none left
        while(next){

            const response = await fetch(base + next);
            if(!response.ok) throw new Error("Mirror.getSerialsHeldBy(): Mirror node request failed (" + response.status + " " + response.statusText + ").");

            const page = await response.json();

            //Ignore any burnt (deleted) NFTs
            for (const nft of page.nfts) {
                if(!nft.deleted) serials.push(nft.serial_number);
            }

            next = page.links && page.links.next;
        }

        return serials;
    }
}
