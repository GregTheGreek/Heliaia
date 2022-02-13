import ethers, { Transaction } from "ethers";

export interface Rule {
    moduleName: string;
    provider: ethers.providers.JsonRpcProvider;
    run(tx: Transaction): Promise<void>;
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
        for (let i=0; i < this.rules.length; i++) {
            await this.rules[i].run(tx);
            console.log("\n")
        }
    }
}