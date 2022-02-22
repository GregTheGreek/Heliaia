import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, Transaction } from "ethers";
import { Rule } from "../engine";
import { isContract, logModuleHeader, serializeTx } from "../utils";
import ethers from "ethers";

import { Erc20Interface } from "./interfacces/erc20";

/**
 * The ERC20 module attempts to inform the user about a given token contract.
 */
export class Erc20Rules implements Rule {
    moduleName = "ERC20 Rule Module";
    useGanache: boolean = true;
    provider: JsonRpcProvider;
    contract: Contract | null;

    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
        this.contract = null;
    }

    async run(tx: Transaction): Promise<void> {
        if (!tx.from) return;
        if (!tx.to) return;
        if (!(await isContract(this.provider, tx.to))) return;
        
        this.contract = new ethers.Contract(tx.to, Erc20Interface, this.provider);
        
        if (!(await this.isErc20(tx.from))) {
            this.log("Not an erc20 contract!");
            return;
        }
        
        const balanceBefore: ethers.BigNumber = await this.contract.balanceOf(tx.from);
        const txResponse = await this.provider.sendTransaction(serializeTx(tx));
        await txResponse.wait();
        const balanceAfter: ethers.BigNumber = await this.contract.balanceOf(tx.from);
        
        if (balanceAfter.gt(balanceBefore)) {
            this.log("Increase");
        } else if (balanceAfter.lt(balanceBefore)) {
            this.log("Decrease");
        } else {
            this.log("No change");
        }
    }

    private log(msg: string): void {
        logModuleHeader(this.moduleName);
        console.log(msg);
    }

    private async isErc20(address: string): Promise<boolean> {
        if (!this.contract) return false;
        try {
            await this.contract.name();
            await this.contract.symbol();
            await this.contract.balanceOf(address);
            return true
        } catch (e) {
            return false
        }
    }
}