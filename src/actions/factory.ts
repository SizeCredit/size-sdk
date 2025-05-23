import { BigNumberish } from "ethers";

type Address = `0x${string}`;

type FactoryFunctionName =
  | "subscribeToCollections"
  | "unsubscribeFromCollections";

export type FactoryOperation = {
  functionName: FactoryFunctionName;
  params: any;
};

export function subscribeToCollections(
  params: BigNumberish[],
): FactoryOperation {
  return {
    functionName: "subscribeToCollections",
    params,
  };
}

export function unsubscribeFromCollections(
  params: BigNumberish[],
): FactoryOperation {
  return {
    functionName: "unsubscribeFromCollections",
    params,
  };
}
