import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { SizeFactory } from "../config";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import { Action, getActionsBitmap, nullActionsBitmap } from "../Authorization";
import {
  OnBehalfOfOperation,
  onBehalfOfOperation,
} from "../actions/onBehalfOf";

type Address = `0x${string}`;

interface TxArgs {
  target: Address;
  data: string;
}

interface Subcall {
  target: Address;
  calldata: string;
  onBehalfOfCalldata?: string;
  action?: Action;
}

function isMarketOperation(
  op: MarketOperation | FactoryOperation,
): op is MarketOperation {
  return "market" in op;
}

export function buildTx(
  onBehalfOf: Address,
  operations: (MarketOperation | FactoryOperation)[],
  recipient?: Address,
): TxArgs {
  const subcalls: Subcall[] = operations.map((operation) => {
    if (isMarketOperation(operation)) {
      const iSize = new ethers.utils.Interface(SizeABI.abi);
      const { market, functionName, params } = operation;
      const onBehalfOfOp = onBehalfOfOperation(
        market,
        functionName,
        params,
        onBehalfOf,
        recipient,
      );
      return {
        target: market,
        calldata: iSize.encodeFunctionData(functionName, [params]),
        onBehalfOfCalldata: onBehalfOfOp
          ? iSize.encodeFunctionData(onBehalfOfOp.functionName, [
              onBehalfOfOp.externalParams,
            ])
          : undefined,
        action: onBehalfOfOp?.action,
      };
    } else {
      const { functionName, params } = operation;
      const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
      const calldata = iSizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: SizeFactory,
        calldata: calldata,
        onBehalfOfCalldata: undefined,
        action: undefined,
      };
    }
  });

  if (subcalls.length <= 1) {
    return {
      target: subcalls[0].target,
      data: subcalls[0].calldata,
    };
  } else {
    const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
    const innerCalls = subcalls.map((op) =>
      op.target === SizeFactory
        ? op.calldata
        : iSizeFactory.encodeFunctionData("callMarket", [
            op.target,
            op.onBehalfOfCalldata,
          ]),
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
