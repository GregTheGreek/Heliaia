import ethers, { Transaction } from "ethers";
export interface RuleResponse {
    result: any;
    error?: string;
}
export interface Rule {
    provider: ethers.providers.JsonRpcProvider;
    run(tx: Transaction): Promise<RuleResponse>;
}
export declare class RuleEngine {
    rules: Rule[];
    constructor(rules?: Rule[]);
    addRule(rule: Rule): void;
    run(tx: Transaction): Promise<void>;
}
