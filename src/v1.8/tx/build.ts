import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import Authorization, { ActionsBitmap, type Action } from "../../Authorization";
import { onBehalfOfOperation } from "../actions/onBehalfOf";
import { Address } from "../../types";

const ISize = new ethers.utils.Interface(SizeABI.abi);
const ISizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);

function isMarketOperation(
  operation: MarketOperation | FactoryOperation,
): operation is MarketOperation {
  return "market" in operation;
}

interface Subcall {
  target: Address;
  calldata: string;
  onBehalfOfCalldata?: string;
  action?: Action;
}

function getSubcalls(
  sizeFactory: Address,
  operations: (MarketOperation | FactoryOperation)[],
  onBehalfOf: Address,
  recipient?: Address,
): Subcall[] {
  return operations.map((operation) => {
    if (isMarketOperation(operation)) {
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
        calldata: ISize.encodeFunctionData(functionName, [params]),
        onBehalfOfCalldata: onBehalfOfOp
          ? ISize.encodeFunctionData(onBehalfOfOp.functionName, [
              onBehalfOfOp.externalParams,
            ])
          : undefined,
        action: onBehalfOfOp?.action,
      };
    } else {
      const { functionName, params } = operation;
      const calldata = ISizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: sizeFactory,
        calldata: calldata,
        onBehalfOfCalldata: undefined,
        action: undefined,
      };
    }
  });
}

function requiresAuthorization(subcalls: Subcall[]): boolean {
  return subcalls
    .map((op) => op.action)
    .some((action): action is Action => action !== undefined);
}

function getActionsBitmap(subcalls: Subcall[]): ActionsBitmap {
  const actions = subcalls
    .map((op) => op.action)
    .filter((action): action is Action => action !== undefined);
  return Authorization.getActionsBitmap(actions);
}

function getSizeFactorySubcallsDatas(
  sizeFactory: Address,
  subcalls: Subcall[],
): string[] {
  return subcalls.map((op) =>
    op.target === sizeFactory
      ? op.calldata
      : ISizeFactory.encodeFunctionData("callMarket", [
          op.target,
          op.onBehalfOfCalldata,
        ]),
  );
}

function getAuthorizationSubcallsDatas(
  sizeFactory: Address,
  subcalls: Subcall[],
): [string, string] | [] {
  if (requiresAuthorization(subcalls)) {
    const auth = ISizeFactory.encodeFunctionData("setAuthorization", [
      sizeFactory,
      getActionsBitmap(subcalls),
    ]);
    const nullAuth = ISizeFactory.encodeFunctionData("setAuthorization", [
      sizeFactory,
      Authorization.nullActionsBitmap(),
    ]);
    return [auth, nullAuth];
  } else {
    return [];
  }
}

interface TxArgs {
  target: Address;
  data: string;
}

export function buildTx(
  sizeFactory: Address,
  onBehalfOf: Address,
  operations: (MarketOperation | FactoryOperation)[],
  recipient?: Address,
): TxArgs {
  const subcalls = getSubcalls(sizeFactory, operations, onBehalfOf, recipient);

  if (subcalls.length === 0) {
    throw new Error("[size-sdk] no operations to execute");
  } else if (subcalls.length == 1) {
    return {
      target: subcalls[0].target,
      data: subcalls[0].calldata,
    };
  } else {
    const sizeFactorySubcallsDatas = getSizeFactorySubcallsDatas(
      sizeFactory,
      subcalls,
    );
    const [maybeAuth, maybeNullAuth] = getAuthorizationSubcallsDatas(
      sizeFactory,
      subcalls,
    );

    const multicall = ISizeFactory.encodeFunctionData("multicall", [
      [maybeAuth, ...sizeFactorySubcallsDatas, maybeNullAuth].filter(Boolean),
    ]);
    return {
      target: sizeFactory,
      data: multicall,
    };
  }
}
