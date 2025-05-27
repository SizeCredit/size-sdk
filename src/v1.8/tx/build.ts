import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import Authorization, { ActionsBitmap, type Action } from "../../Authorization";
import { onBehalfOfOperation } from "../actions/onBehalfOf";
import { Address } from "../../types";
import { TxArgs } from "../../index";

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

export class TxBuilder {
  private readonly sizeFactory: Address;

  constructor(sizeFactory: Address) {
    this.sizeFactory = sizeFactory;
  }

  private getSubcalls(
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
        const calldata = ISizeFactory.encodeFunctionData(functionName, [
          params,
        ]);
        return {
          target: this.sizeFactory,
          calldata: calldata,
          onBehalfOfCalldata: undefined,
          action: undefined,
        };
      }
    });
  }

  private requiresAuthorization(subcalls: Subcall[]): boolean {
    return subcalls
      .map((op) => op.action)
      .some((action): action is Action => action !== undefined);
  }

  private getActionsBitmap(subcalls: Subcall[]): ActionsBitmap {
    const actions = subcalls
      .map((op) => op.action)
      .filter((action): action is Action => action !== undefined);
    return Authorization.getActionsBitmap(actions);
  }

  private getSizeFactorySubcallsDatas(subcalls: Subcall[]): string[] {
    return subcalls.map((op) =>
      op.target === this.sizeFactory
        ? op.calldata
        : ISizeFactory.encodeFunctionData("callMarket", [
            op.target,
            op.onBehalfOfCalldata,
          ]),
    );
  }

  private getAuthorizationSubcallsDatas(
    subcalls: Subcall[],
  ): [string, string] | [] {
    if (this.requiresAuthorization(subcalls)) {
      const auth = ISizeFactory.encodeFunctionData("setAuthorization", [
        this.sizeFactory,
        this.getActionsBitmap(subcalls),
      ]);
      const nullAuth = ISizeFactory.encodeFunctionData("setAuthorization", [
        this.sizeFactory,
        Authorization.nullActionsBitmap(),
      ]);
      return [auth, nullAuth];
    } else {
      return [];
    }
  }

  build(
    onBehalfOf: Address,
    operations: (MarketOperation | FactoryOperation)[],
    recipient?: Address,
  ): TxArgs[] {
    const subcalls = this.getSubcalls(operations, onBehalfOf, recipient);

    if (subcalls.length === 0) {
      throw new Error("[size-sdk] no operations to execute");
    } else if (subcalls.length == 1) {
      return [
        {
          target: subcalls[0].target,
          data: subcalls[0].calldata,
        },
      ];
    } else {
      const sizeFactorySubcallsDatas =
        this.getSizeFactorySubcallsDatas(subcalls);
      const [maybeAuth, maybeNullAuth] =
        this.getAuthorizationSubcallsDatas(subcalls);

      const multicall = ISizeFactory.encodeFunctionData("multicall", [
        [maybeAuth, ...sizeFactorySubcallsDatas, maybeNullAuth].filter(Boolean),
      ]);
      return [
        {
          target: this.sizeFactory,
          data: multicall,
        },
      ];
    }
  }
}
