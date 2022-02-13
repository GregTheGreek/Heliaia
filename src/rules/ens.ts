import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule } from "./engine";
import { logModuleHeader, truncateAddress } from "./utils";

/**
 * The ENS rule attempts lookup any ENS names assosiated with the
 * addresses used in the transaction.
 */
export class EnsRules implements Rule {
    moduleName = "ENS Rule Module";

    provider: JsonRpcProvider;

    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<void> {
        let to, from;
        if (tx.from) {
            from = await this.provider.lookupAddress(tx.from);
        }
        if (tx.to) {
            to = await this.provider.lookupAddress(tx.to);
        }
        this.log(tx, to as undefined, from as undefined);
    }

    private log(tx: Transaction, to?: string, from?: string): void {
        logModuleHeader(this.moduleName);
        
        if (from) {
            console.log(`From: ${from} (${truncateAddress(tx.from as string)})`);
        } else {
            console.log(`From: ${tx.from}`);
        }

        if (to) {
            console.log(`To: ${to} (${truncateAddress(tx.to as string)})`);
        } else if (tx.to) {
            console.log(`To: ${tx.to}`);
        } else {
            console.log("To: [Contract creation]");
        }
    }
}