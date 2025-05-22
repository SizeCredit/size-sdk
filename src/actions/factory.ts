import { BigNumberish } from "ethers";

type Address = `0x${string}`;

type FactoryFunctionName = "subscribeToCollections";

export type FactoryOperation = {
  factory: Address;
  functionName: FactoryFunctionName;
  params: any;
};

export function subscribeToCollections(
  factory: Address,
  params: BigNumberish[],
): FactoryOperation {
  return {
    factory,
    functionName: "subscribeToCollections",
    params,
  };
} 