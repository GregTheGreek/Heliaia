# Heliaia

Heliaia is a proxy that sits between your wallet and a node, with the sole purpose to intercept transactions before they are broadcasted. Transactions are thuroughly analysed by various rules that provide the user with deep insights into what they are signing. Wallet UIs can only present you with so much information before it becomes exhaustive. Heliaia aims to provide a user with an indepth analysis of their transactons to help them make a more informed decision when signing transactions.

TL/DR: If you're paranoid like me, this is the sanity check you need.

## Motiviation

Wallet UIs can only present you with so much information before it becomes exhaustive. Heliaia aims to provide you with

## Name Origins

Heliaia was the supreme court of ancient Athens, the Heliaia functioned as a court for litigation of public, criminal and private international law. A fitting name for a tool that scrutinizes a transaction to ensure it adhers to a strict set of rules. I'm also Greek and chose this purely on bias :)

## Usage

```
git clone https://github.com/GregTheGreek/Heliaia.git
cd Heliaia
yarn
yarn start [args]
```

Available command line arguments:

```
Options:
  -r --rpc <url>      RPC URL to proxy to (default: "http://localhost:8545/")
  -p --port <number>  Port number to listen on (default: "9545")
  -h, --help          display help for command
```

Once started, connect your wallet (eg, MetaMask) to the endpoint exposed by the proxy (by default, http://localhost:9545/), and interact with apps and contracts normally.

When rules are run, they'll appear in the terminal like so:
```
=========================
==== ENS Rule Module ====
=========================
From: 0xCC71BBe481A50b9fb36afD36aE6EF63FE8eD94bB
To: example.eth (0xabc...1234)
```
As a user you can then choose to submit the transaction or reject it:
```
Do you want to submit the transaction?
? Do you want to submit the transaction? › (y/N)
```

## Features
- Ens checks
- Contract verification 
- Malicious address (todo)
    - Warn the user about any flagged addresses (eg: DAO hacker, spam token)
    - 0x0 address?
- Known contracts (todo)
    - For known contracts describe the interaction in english
- Allow the user to choose which rules to apply (todo)
  - Store a config file somewhere?
- Simulate calls in ganache (todo)
- ?

## Inspiration

Inspired by Nick Johnson's [flashbots-proxy](https://github.com/Arachnid/flashbots-proxy)

## Disclaimer

This has not been extensively tested. I take no responsibility for any damages it causes, and you use it entirely at your own risk.
