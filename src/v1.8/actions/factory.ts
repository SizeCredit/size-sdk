import { BigNumberish } from "ethers";
import { Address } from "../../types";

type FactoryFunctionName =
  | "subscribeToCollections"
  | "unsubscribeFromCollections";

export type FactoryOperation = {
  functionName: FactoryFunctionName;
  params: BigNumberish[];
};

export class FactoryActions {
  constructor(
    private readonly sizeFactory: Address,
    private readonly collectionManager: Address,
  ) {}

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
