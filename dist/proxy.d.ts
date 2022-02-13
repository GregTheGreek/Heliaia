import ethers from "ethers";
import { RuleEngine } from "./rules/engine";
export declare class Proxy {
    txParams: any[] | undefined;
    provider: ethers.providers.JsonRpcProvider;
    ruleEngine: RuleEngine;
    constructor(provider: ethers.providers.JsonRpcProvider, ruleEngine: RuleEngine);
    rpcHandler(method: string, params: any): Promise<any>;
    private transactionHandler;
    private showPrompt;
}
