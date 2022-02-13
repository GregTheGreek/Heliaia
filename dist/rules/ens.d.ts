import { JsonRpcProvider } from "@ethersproject/providers";
import { Transaction } from "ethers";
import { Rule, RuleResponse } from "./engine";
/**
 * The ENS rule attempts lookup any ENS names assosiated with the
 * addresses used in the transaction.
 */
export declare class EnsRules implements Rule {
    provider: JsonRpcProvider;
    constructor(provider: JsonRpcProvider);
    run(tx: Transaction): Promise<RuleResponse>;
}
