import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Contract, Transaction } from "ethers";
import { Rule } from "../../engine";
import { formatUnits, isContract, logModuleHeader, serializeTx } from "../utils";
import ethers from "ethers";

import { Erc20Interface } from "./interfacces/erc20";

interface Balances {
    balanceBefore: BigNumber;
    balanceAfter: BigNumber;
    diff: BigNumber;
}

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
            this.log();
            console.log("Not an erc20 contract!");
            return;
        }
        
        const balances = await this.checkBalance(tx);
        await this.log(balances)
    }

    private async log(balances?: Balances): Promise<void> {
        logModuleHeader(this.moduleName);
        if (balances) {
            // @ts-ignore
            const decimals = await this.contract.decimals();
            console.log(`Balance Before: ${formatUnits(balances.balanceBefore, decimals)}`)
            console.log(`Balance After:  ${formatUnits(balances.balanceAfter, decimals)}`)
            console.log(`Balance Diff:   ${formatUnits(balances.diff, decimals)}`)
        }
    }

    private async checkBalance(tx: Transaction): Promise<Balances> {
        if (!this.contract) return {} as Balances;
        const balanceBefore: ethers.BigNumber = await this.contract.balanceOf(tx.from);
        const txResponse = await this.provider.sendTransaction(serializeTx(tx));
        await txResponse.wait();
        const balanceAfter: ethers.BigNumber = await this.contract.balanceOf(tx.from);
        const diff = balanceAfter.sub(balanceBefore);

        return {
            balanceBefore,
            balanceAfter,
            diff
        }
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