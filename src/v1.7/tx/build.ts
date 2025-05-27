import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import { TxArgs } from "../../index";
import { Address } from "../../types";

function isMarketOperation(
  operation: MarketOperation | FactoryOperation,
): operation is MarketOperation {
  return "market" in operation;
}

export class TxBuilder {
  private readonly sizeFactory: Address;
  private readonly ISize: ethers.utils.Interface;
  private readonly ISizeFactory: ethers.utils.Interface;

  constructor(sizeFactory: Address) {
    this.sizeFactory = sizeFactory;
    this.ISize = new ethers.utils.Interface(SizeABI.abi);
    this.ISizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
  }

  build(
    onBehalfOf: Address,
    operations: (MarketOperation | FactoryOperation)[],
    recipient?: Address,
  ): TxArgs[] {
    return operations.map((operation) => {
      if (isMarketOperation(operation)) {
        const { market, functionName, params } = operation;
        const calldata = this.ISize.encodeFunctionData(functionName, [params]);
        return {
          target: market,
          data: calldata,
        };
      } else {
        const { functionName, params } = operation;
        const calldata = this.ISizeFactory.encodeFunctionData(functionName, [
          params,
        ]);
        return {
          target: this.sizeFactory,
          data: calldata,
        };
      }
    });
  }
}
