export const SizeFactory = "0x000000000000000000000000000000000000ffff";

type ChainId = number;
type Address = `0x${string}`;

const MAINNET_CHAIN_ID = 1;
const BASE_CHAIN_ID = 8453;

export const Addresses: Record<ChainId, Record<string, Address>> = {
  [MAINNET_CHAIN_ID]: {
    SizeFactory,
  },
  [BASE_CHAIN_ID]: {
    SizeFactory,
  },
};
