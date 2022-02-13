import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";

import { Rule } from "../engine";
import { isContract, logModuleHeader } from "../utils";
import { knownContracts } from "./knownContracts";

/**
 * The Dapp rule attempts lookup known information about a given address to provide the user
 * with a human readbale understanding of the transaction opperation.
 */
export class ContractVerificationRules implements Rule {
    moduleName = "Dapp Rule Module";

    provider: JsonRpcProvider;
    
    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<void> {
        if (tx.to && isContract(this.provider, tx.to)) {
            const info = knownContracts[tx.to];
            if (info) {
                // @Todo
            } else {
                this.log(`No known contract at ${tx.to}`)
            }
        }
    }

    private log(msg: string): void {
        logModuleHeader(this.moduleName);
        console.log(msg);
    }
}