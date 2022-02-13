import { Command } from 'commander';
import ethers from 'ethers';
import express from 'express';
const cors = require("cors");

import {Proxy} from "./proxy";
import { RuleEngine } from './rules/engine';
import { EnsRules } from './rules/ens';
import { EtherscanRules } from './rules/etherscan';

// CLI
const program = new Command();
program
  .option('-r --rpc <url>', 'RPC URL to proxy to', 'http://localhost:8545/')
  .option('-p --port <number>', 'Port number to listen on', '9545');

program.parse(process.argv);
const options = program.opts();

// Setup proxy and rules
const provider = new ethers.providers.JsonRpcProvider({ url: options.rpc });
const rules = [
  new EnsRules(provider),
  new EtherscanRules(provider),
]
const ruleEngine = new RuleEngine(rules);
const proxy = new Proxy(provider, ruleEngine);

// Proxy server Logic
const app = express();
app.use(express.json());
app.use(cors());

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