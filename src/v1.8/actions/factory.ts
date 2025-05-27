import { BigNumberish } from "ethers";

type FactoryFunctionName =
  | "subscribeToCollections"
  | "unsubscribeFromCollections";

export type FactoryOperation = {
  functionName: FactoryFunctionName;
  params: BigNumberish[];
};

export class FactoryActions {
  constructor() {}

  subscribeToCollections(params: BigNumberish[]): FactoryOperation {
    return {
      functionName: "subscribeToCollections",
      params,
    };
  }

  unsubscribeFromCollections(params: BigNumberish[]): FactoryOperation {
    return {
      functionName: "unsubscribeFromCollections",
      params,
    };
  }
}
