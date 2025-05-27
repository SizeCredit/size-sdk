import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import { TxArgs } from "../../index";
import { Address } from "../../types";

const ISize = new ethers.utils.Interface(SizeABI.abi);
const ISizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);

function isMarketOperation(
  operation: MarketOperation | FactoryOperation,
): operation is MarketOperation {
  return "market" in operation;
}

export function buildTx(
  sizeFactory: Address,
  onBehalfOf: Address,
  operations: (MarketOperation | FactoryOperation)[],
  recipient?: Address,
): TxArgs[] {
  return operations.map((operation) => {
    if (isMarketOperation(operation)) {
      const { market, functionName, params } = operation;
      const calldata = ISize.encodeFunctionData(functionName, [params]);
      return {
        target: market,
        data: calldata,
      };
    } else {
      const { functionName, params } = operation;
      const calldata = ISizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: sizeFactory,
        data: calldata,
      };
    }
  });
}
