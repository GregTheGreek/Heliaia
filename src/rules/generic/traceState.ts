import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule } from "../../engine";
import { logModuleHeader, serializeTx } from "../utils";
  
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
        try {
            const txResponse = await this.provider.sendTransaction(serializeTx(tx));
            const txReceipt = await txResponse.wait();
            console.log(txReceipt);
            const trace = await this.provider.send("debug_traceTransaction", [txReceipt.transactionHash])
            console.log(trace)
        } catch (e) {
            console.log(e);
        }
    }
}