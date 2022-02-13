import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule, RuleResponse } from "./engine";
import axios from "axios";

/**
 * The ENS rule attempts lookup any ENS names assosiated with the
 * addresses used in the transaction.
 */
export class EtherscanRules implements Rule {
    provider: JsonRpcProvider;
    
    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<RuleResponse> {
        let verified;
        if (tx.to) {
            const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tx.to}`;
            const res = await axios.get(url);
            if (res.data.status === "0") {
                verified = false;
            } else if (res.data.status === "1") {
                verified = true;
            }
        }

        return {
            result: {
                verified
            }
        }
    }
}