import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import { MarketOperation } from "../actions/market";
import { TxArgs } from "../../index";
import { Address } from "../../types";

export class TxBuilder {
  private readonly ISize: ethers.utils.Interface;

  constructor() {
    this.ISize = new ethers.utils.Interface(SizeABI.abi);
  }

  build(
    onBehalfOf: Address,
    operations: MarketOperation[],
    recipient?: Address,
  ): TxArgs[] {
    return operations.map((operation) => {
      const { market, functionName, params } = operation;
      const calldata = this.ISize.encodeFunctionData(functionName, [params]);
      return {
        target: market,
        data: calldata,
      };
    });
  }
}
