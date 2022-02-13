import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule, RuleResponse } from "./engine";

/**
 * The ENS rule attempts lookup any ENS names assosiated with the
 * addresses used in the transaction.
 */
export class EnsRules implements Rule {
    provider: JsonRpcProvider;
    
    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<RuleResponse> {
        let from, to;
        if (tx.from) {
            from = await this.provider.lookupAddress(tx.from);
        }
        if (tx.to) {
            to = await this.provider.lookupAddress(tx.to);
        }

        return {
            result: {
                from,
                to
            }
        }
    }
}