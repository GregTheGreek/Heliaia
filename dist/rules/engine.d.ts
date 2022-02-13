import ethers, { Transaction } from "ethers";
export interface Rule {
    moduleName: string;
    provider: ethers.providers.JsonRpcProvider;
    run(tx: Transaction): Promise<void>;
}
export declare class RuleEngine {
    rules: Rule[];
    constructor(rules?: Rule[]);
    addRule(rule: Rule): void;
    run(tx: Transaction): Promise<void>;
}
