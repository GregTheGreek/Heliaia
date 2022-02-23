import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule } from "../../engine";
import axios from "axios";
import { isContract, logModuleHeader } from "../utils";

/**
 * The Contract Verification module attempts to find verified smart contract code.
 */
export class ContractVerificationRules implements Rule {
    moduleName = "Contract Verification Rule Module";
    useGanache: boolean = false;
    provider: JsonRpcProvider;
    
    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<void> {
        let verified;
        if (tx.to) {
            if (await isContract(this.provider, tx.to)) {
                const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tx.to}`;
                const res = await axios.get(url);
                if (res.data.status === "0") {
                    verified = false;
                } else if (res.data.status === "1") {
                    verified = true;
                }
            }
        }
        this.log(verified as boolean)
    }

    private log(verified: boolean): void {
        logModuleHeader(this.moduleName);

        if (verified) {
            console.log("The contract is verified.")
        } else {
            console.log("The contract is not verified.")
        }
    }
}