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

function isFactoryOperation(
  op: Operation | FactoryOperation,
): op is FactoryOperation {
  return "factory" in op;
}

export function buildTx(operations: (Operation | FactoryOperation)[]): TxArgs {
  const subcalls = operations.map((operation) => {
    if (isFactoryOperation(operation)) {
      const { factory, functionName, params } = operation;
      const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
      const calldata = iSizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: factory,
        data: calldata,
      };
    } else {
      const iSize = new ethers.utils.Interface(SizeABI.abi);
      const { market, functionName, params } = operation;
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
    const auth = iSizeFactory.encodeFunctionData("setAuthorization", [
      SizeFactory,
      ethers.constants.MaxUint256,
    ]);
    const innerCalls = subcalls.map((op) =>
      op.target === SizeFactory
        ? op.data
        : iSizeFactory.encodeFunctionData("callMarket", [op.target, op.data]),
    );
    const noAuth = iSizeFactory.encodeFunctionData("setAuthorization", [
      SizeFactory,
      0n,
    ]);
    const multicall = iSizeFactory.encodeFunctionData("multicall", [
      [auth, ...innerCalls, noAuth],
    ]);
    return {
      target: SizeFactory as Address,
      data: multicall,
    };
  }
}
