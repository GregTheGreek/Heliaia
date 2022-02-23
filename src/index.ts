import { Command } from 'commander';
import ethers from 'ethers';
import express from 'express';
const cors = require("cors");

import {Proxy} from "./proxy";
import { RuleEngine } from './engine';
import Rules from './rules';
import { selectRules } from './ruleSelector';

// CLI
const program = new Command();
program
  .option('-r --rpc <url>', 'RPC URL to proxy to', 'http://localhost:8545/')
  .option('-p --port <number>', 'Port number to listen on', '9545');
program.parse(process.argv);
const options = program.opts();

(async () => {

  // Instantiate provider from cli
  const provider = new ethers.providers.JsonRpcProvider({ url: options.rpc });

  // Prompt user to select rules
  const selectedRules = await selectRules();
  const rules = selectedRules.map((name:string) => {
    // Not sure how to get around typings for this.
    // @ts-ignore 
    return new Rules[name](provider);
  })

  // Setup rule engine and proxy
  const ruleEngine = new RuleEngine(provider, rules);
  const proxy = new Proxy(provider, ruleEngine);

  // Proxy server configuration
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Proxy server routes
  app.post('/', async (req, res) => {
    const { id, method, params } = req.body;
    try {
      const result = await proxy.rpcHandler(method, params);
      res.json({
        jsonrpc: "2.0",
        id,
        result
      });
    } catch(e) {
      if((e as any)?.body !== undefined) {
        const { error } = JSON.parse((e as any).body);
        res.json({
          jsonrpc: "2.0",
          id,
          error
        });
      } else {
        console.log(e);
      }
    }
  });

  app.listen(parseInt(options.port), () => {
    console.log(`Listening on port ${options.port}`);
  });

})();