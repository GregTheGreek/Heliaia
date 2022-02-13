import ethers, { Transaction } from "ethers";

export interface RuleResponse {
    result: any; // @todo
    error?: string;
}

export interface Rule {
    provider: ethers.providers.JsonRpcProvider;
    run(tx: Transaction): Promise<RuleResponse>;
}

export class RuleEngine {
    rules: Rule[];
    constructor(rules: Rule[] = []) {
        this.rules = [];
        rules.map(x => this.addRule(x));
    };

    addRule(rule: Rule): void {
        this.rules.push(rule);
    }

    async run(tx: Transaction): Promise<void> {
        const results = [];
        for (let i=0; i < this.rules.length; i++) {
            results.push(await this.rules[i].run(tx));
        }
        // @TODO Parse responses
    }
}