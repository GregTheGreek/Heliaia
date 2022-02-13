/**
 * The purpose of this is to create a list of known addresses that are assosiated to a specific app so we can dynaimcally select which module to run.
 */

import { Uniswapv2Rules } from "./uniswapv2";

export interface ContractList {
    [name: string]: ContractInfo;
}

export interface ContractInfo {
    name: string;
    module: { new(...args: any[]): any; }; // @TODO make this type Rule
}

export const knownContracts: ContractList = {
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D": {
        name: "Uniswap v2: Router 2",
        module: Uniswapv2Rules
    }
}