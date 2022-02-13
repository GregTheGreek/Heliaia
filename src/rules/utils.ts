import { JsonRpcProvider } from "@ethersproject/providers";

export const logModuleHeader = (name: string) => {
    console.log(`=====${"=".repeat(name.length)}=====`)
    console.log(`==== ${name} ====`)
    console.log(`=====${"=".repeat(name.length)}=====`)
}

export const truncateAddress = (address: string) => {
    const start = address.substring(0,5);
    const end = address.substring(38);
    return `${start}...${end}`;
}

export const isContract = async (provider: JsonRpcProvider, address: string): Promise<boolean> => {
    const code = await provider.getCode(address);
    return code != "0x" ? true : false;
}