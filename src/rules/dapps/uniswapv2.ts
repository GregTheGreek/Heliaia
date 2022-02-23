import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";

import { Rule } from "../../engine";
import { logModuleHeader } from "../utils";

/**
 * The Uniswapv2 Modules describes various opperations made on uniswap.
 */
export class Uniswapv2Rules implements Rule {
    moduleName = "UniswapV2 Rule Module";
    useGanache: boolean = false;
    provider: JsonRpcProvider;
    
    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
    }

    async run(tx: Transaction): Promise<void> {
        this.log("TODO" + tx);
    }

    private log(msg: string): void {
        logModuleHeader(this.moduleName);
        console.log(msg);
    }
}