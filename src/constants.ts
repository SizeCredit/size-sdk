import { BigNumber, ethers } from "ethers";
import { CopyLimitOrderConfigStructOutput } from "./v1.8/types-v1_8/ethers-contracts/Size";

export const FullCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: ethers.constants.MaxUint256,
  minAPR: BigNumber.from(0),
  maxAPR: ethers.constants.MaxUint256,
  offsetAPR: BigNumber.from(0),
} as CopyLimitOrderConfigStructOutput;

export const NoCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: BigNumber.from(0),
  minAPR: BigNumber.from(0),
  maxAPR: BigNumber.from(0),
  offsetAPR: ethers.constants.MinInt256,
} as CopyLimitOrderConfigStructOutput;

export const NullCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: BigNumber.from(0),
  minAPR: BigNumber.from(0),
  maxAPR: BigNumber.from(0),
  offsetAPR: BigNumber.from(0),
} as CopyLimitOrderConfigStructOutput;
