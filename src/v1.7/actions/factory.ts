import { Address } from "../../types";

type FactoryFunctionName = never;

export type FactoryOperation = {
  functionName: FactoryFunctionName;
  params: never[];
};

export class FactoryActions {
  constructor(private readonly sizeFactory: Address) {}
}
