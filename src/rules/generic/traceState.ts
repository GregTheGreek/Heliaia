import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule } from "../engine";
import { logModuleHeader } from "../utils";
import ethers from "ethers";
  
/**
 * The ENS module attempts lookup any ENS names assosiated with the
 * addresses used in the transaction.
 */
export class ForkStateRules implements Rule {
    moduleName = "Fork State Rule Module";
    useGanache: boolean = true;
    provider: JsonRpcProvider;

    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }
    // @ts-ignore
    async run(tx: Transaction): Promise<void> {
        await this.log(tx);
    }

    private async log(tx: Transaction): Promise<void> {
        logModuleHeader(this.moduleName);
        const signedTx = ethers.utils.serializeTransaction(
            tx, 
            {r: tx.r as string, s: tx.s as string, v: tx.v as number}
        );
        const txResponse = await this.provider.sendTransaction(signedTx);
        const txReceipt = await txResponse.wait();
        console.log(txReceipt);
        const trace = await this.provider.send("debug_traceTransaction", [txReceipt.transactionHash])
        console.log(trace)
    }
}