import ethers from "ethers";
import { RuleEngine } from "./engine";
const prompts = require('prompts');

export class Proxy {
  txParams: any[] | undefined;
  provider: ethers.providers.JsonRpcProvider;
  ruleEngine: RuleEngine;

  constructor(provider: ethers.providers.JsonRpcProvider, ruleEngine: RuleEngine) {
    this.provider = provider;
    this.ruleEngine = ruleEngine;
  }

  async rpcHandler(method: string, params: any): Promise<any> {
    switch(method) {
    case 'eth_sendRawTransaction':
      return this.transactionHandler(params as any[]);
    default:
      return this.provider.send(method, params);
    }
  }

  private async transactionHandler(params: any[]) {
    const tx = ethers.utils.parseTransaction(params[0]);
    
    // Run all rules
    await this.ruleEngine.run(tx);
    console.log("after")
    if (!await this.showPrompt()) {
      console.log("Rejecting...")
      return;
    }
    console.log("Submitting...")
    return this.provider.send('eth_sendRawTransaction', params);
  }

  private async showPrompt() {
    console.log("Do you want to submit the transaction?");
    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Do you want to submit the transaction?',
    });
    return response.value;
  }
}