import { JsonRpcProvider } from "@ethersproject/providers";
import ethers from "ethers";
import Ganache from "ganache";

/**
 * The Ganache module sanboxes a forking environment.
 */
export class GanacheEngine {
    provider: JsonRpcProvider;

    constructor(rpcUrl: string) {
        this.provider = this.fork(rpcUrl);
    }

    private fork = (rpcUrl: string): JsonRpcProvider => {
        console.log("Forking ganache...")
        const ganacheProvider = Ganache.provider({
            fork: {
                url: rpcUrl
            },
            miner: {
                blockTime: 0
            },
            logging: {
                logger: {
                    log: () => {}
                }
            }
        })
        // @ts-ignore
        return new ethers.providers.Web3Provider(ganacheProvider);       
    }

    run = async () => {
        console.log(`Created fork at block ${await this.provider.getBlockNumber()}`);
    }
}