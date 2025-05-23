import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { SizeFactory } from "../config";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import {
  Action,
  FunctionNameToAction,
  getActionsBitmap,
  nullActionsBitmap,
} from "../Authorization";

type Address = `0x${string}`;

interface TxArgs {
  target: Address;
  data: string;
}

interface Subcall extends TxArgs {
  action?: Action;
}

function isMarketOperation(
  op: MarketOperation | FactoryOperation,
): op is MarketOperation {
  return "market" in op;
}

export function buildTx(
  operations: (MarketOperation | FactoryOperation)[],
): TxArgs {
  const subcalls: Subcall[] = operations.map((operation) => {
    if (isMarketOperation(operation)) {
      const iSize = new ethers.utils.Interface(SizeABI.abi);
      const { market, functionName, params } = operation;
      const calldata = iSize.encodeFunctionData(functionName, [params]);
      return {
        target: market,
        data: calldata,
        action: FunctionNameToAction[functionName],
      };
    } else {
      const { functionName, params } = operation;
      const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
      const calldata = iSizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: SizeFactory,
        data: calldata,
        action: undefined,
      };
    }
  });

  if (subcalls.length <= 1) {
    return {
      target: subcalls[0].target,
      data: subcalls[0].data,
    };
  } else {
    const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
    const innerCalls = subcalls.map((op) =>
      op.target === SizeFactory
        ? op.data
        : iSizeFactory.encodeFunctionData("callMarket", [op.target, op.data]),
    );

    const actions = subcalls
      .map((op) => op.action)
      .filter((action): action is Action => action !== undefined);

    if (actions.length === 0) {
      return {
        target: SizeFactory as Address,
        data: iSizeFactory.encodeFunctionData("multicall", [innerCalls]),
      };
    } else {
      const auth = iSizeFactory.encodeFunctionData("setAuthorization", [
        SizeFactory,
        getActionsBitmap(actions),
      ]);
      const noAuth = iSizeFactory.encodeFunctionData("setAuthorization", [
        SizeFactory,
        nullActionsBitmap(),
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
}
