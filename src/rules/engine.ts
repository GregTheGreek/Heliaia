import ethers, { Transaction } from "ethers";
import { GanacheEngine } from "./ganache";
import { JsonRpcProvider } from "@ethersproject/providers";

export interface Rule {
    moduleName: string;
    useGanache: boolean;
    provider: ethers.providers.JsonRpcProvider;
    run(tx: Transaction): Promise<void>;
}

export class RuleEngine {
    rules: Rule[] = [];
    provider: JsonRpcProvider;
    ganache: GanacheEngine;

    constructor(provider: JsonRpcProvider, rules: Rule[] = []) {
        this.provider = provider;
        this.ganache = new GanacheEngine(provider.connection.url)
        rules.map(x => this.addRule(x));
    };

    addRule(rule: Rule): void {
        if (rule.useGanache) {
            rule.provider = this.ganache.provider;
        }
        this.rules.push(rule);
    }

    async run(tx: Transaction): Promise<void> {
        for (let i=0; i < this.rules.length; i++) {
            await this.rules[i].run(tx);
            console.log("\n")
        }
    }
}