import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { SizeFactory } from "../config";
import { Operation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";

type Address = `0x${string}`;

interface TxArgs {
  target: Address;
  data: string;
}

export function buildTx(operations: (Operation | FactoryOperation)[]): TxArgs {
  const subcalls = operations.map((op) => {
    if ("factory" in op) {
      const { factory, functionName, params } = op;
      const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
      const calldata = iSizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: factory,
        data: calldata,
      };
    } else {
      const iSize = new ethers.utils.Interface(SizeABI.abi);
      const { market, functionName, params } = op;
      const calldata = iSize.encodeFunctionData(functionName, [params]);
      return {
        target: market,
        data: calldata,
      };
    }
  });

  if (subcalls.length <= 1) {
    return subcalls[0];
  } else {
    const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
    const multicall = iSizeFactory.encodeFunctionData("multicall", [
      // FIXME: add auth
      subcalls.map((op) =>
        op.target === SizeFactory
          ? op.data
          : iSizeFactory.encodeFunctionData("callMarket", [op.target, op.data]),
      ),
    ]);
    return {
      target: SizeFactory as Address,
      data: multicall,
    };
  }
} 