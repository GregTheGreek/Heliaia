import ethers, { Transaction } from "ethers";
import { GanacheEngine } from "./rules/ganache";
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
        // Create ganache instancing for forking features
        this.ganache = new GanacheEngine(provider.connection.url)
        rules.map(x => this.addRule(x));
    };

    addRule(rule: Rule): void {
        // If rule requires ganache forking, swap provider
        // @TODO - ganache may need to be instatiated in the rule itself
        // I think this is actually causing the fork to happen too early.
        // We should fork on demand
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