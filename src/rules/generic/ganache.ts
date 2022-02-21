import { Web3Provider } from "@ethersproject/providers";
import ethers from "ethers";
import ganache from "ganache";

/**
 * The Ganache module sanboxes a forking environment.
 */
export class GanacheEngine {
    provider: Web3Provider;

    constructor(rpcUrl: string) {
        this.provider = this.setup(rpcUrl);
    }

    private setup = (rpcUrl: string): Web3Provider => {
        const ganacheProvider = ganache.provider({
            fork: {
                url: rpcUrl
            },
            miner: {
                blockTime: 1
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

    fork = async () => {
        console.log(`Created fork at block ${await this.provider.getBlockNumber()}`);
    }
}