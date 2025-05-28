import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import SizeFactoryABI from "../abi/SizeFactory.json";
import ERC20ABI from "../../erc20/abi/ERC20.json";
import { MarketOperation } from "../actions/market";
import { FactoryOperation } from "../actions/factory";
import { ERC20Operation } from "../../erc20/actions";
import Authorization, { ActionsBitmap, type Action } from "../../Authorization";
import { onBehalfOfOperation } from "../actions/onBehalfOf";
import { Address } from "../../types";
import { TxArgs } from "../../index";

function isMarketOperation(
  operation: MarketOperation | FactoryOperation | ERC20Operation,
): operation is MarketOperation {
  return "market" in operation;
}

function isERC20Operation(
  operation: MarketOperation | FactoryOperation | ERC20Operation,
): operation is ERC20Operation {
  return "functionName" in operation && operation.functionName === "approve";
}

interface Subcall {
  target: Address;
  calldata: string;
  isERC20: boolean;
  onBehalfOfCalldata?: string;
  action?: Action;
}

export class TxBuilder {
  private readonly sizeFactory: Address;
  private readonly ISize: ethers.utils.Interface;
  private readonly ISizeFactory: ethers.utils.Interface;
  private readonly IERC20: ethers.utils.Interface;

  constructor(sizeFactory: Address) {
    this.sizeFactory = sizeFactory;
    this.ISize = new ethers.utils.Interface(SizeABI.abi);
    this.ISizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
    this.IERC20 = new ethers.utils.Interface(ERC20ABI.abi);
  }

  private getSubcalls(
    operations: (MarketOperation | FactoryOperation | ERC20Operation)[],
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
          calldata: this.ISize.encodeFunctionData(functionName, [params]),
          isERC20: false,
          onBehalfOfCalldata: onBehalfOfOp
            ? this.ISize.encodeFunctionData(onBehalfOfOp.functionName, [
                onBehalfOfOp.externalParams,
              ])
            : undefined,
          action: onBehalfOfOp?.action,
        };
      } else if (isERC20Operation(operation)) {
        const { token, functionName, params } = operation;
        return {
          target: token,
          calldata: this.IERC20.encodeFunctionData(functionName, params),
          isERC20: true,
          onBehalfOfCalldata: undefined,
          action: undefined,
        };
      } else {
        const { functionName, params } = operation;
        const calldata = this.ISizeFactory.encodeFunctionData(functionName, [
          params,
        ]);
        return {
          target: this.sizeFactory,
          calldata: calldata,
          isERC20: false,
          onBehalfOfCalldata: undefined,
          action: undefined,
        };
      }
    });
  }

  private getERC20Subcalls(subcalls: Subcall[]): TxArgs[] {
    return subcalls
      .filter((op) => op.isERC20)
      .map((op) => ({
        target: op.target,
        data: op.calldata,
      }));
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
    return subcalls
      .filter((op) => !op.isERC20)
      .map((op) =>
        op.target === this.sizeFactory
          ? op.calldata
          : this.ISizeFactory.encodeFunctionData("callMarket", [
              op.target,
              op.onBehalfOfCalldata,
            ]),
      );
  }

  private getAuthorizationSubcallsDatas(
    subcalls: Subcall[],
  ): [string, string] | [] {
    if (this.requiresAuthorization(subcalls)) {
      const auth = this.ISizeFactory.encodeFunctionData("setAuthorization", [
        this.sizeFactory,
        this.getActionsBitmap(subcalls),
      ]);
      const nullAuth = this.ISizeFactory.encodeFunctionData(
        "setAuthorization",
        [this.sizeFactory, Authorization.nullActionsBitmap()],
      );
      return [auth, nullAuth];
    } else {
      return [];
    }
  }

  build(
    onBehalfOf: Address,
    operations: (MarketOperation | FactoryOperation | ERC20Operation)[],
    recipient?: Address,
  ): TxArgs[] {
    const subcalls = this.getSubcalls(operations, onBehalfOf, recipient);

    if (subcalls.length === 0) {
      throw new Error("[@sizecredit/sdk] no operations to execute");
    } else if (subcalls.length == 1) {
      return [
        {
          target: subcalls[0].target,
          data: subcalls[0].calldata,
        },
      ];
    } else {
      const erc20Subcalls = this.getERC20Subcalls(subcalls);
      const sizeFactorySubcallsDatas =
        this.getSizeFactorySubcallsDatas(subcalls);
      const [maybeAuth, maybeNullAuth] =
        this.getAuthorizationSubcallsDatas(subcalls);

      const multicall = this.ISizeFactory.encodeFunctionData("multicall", [
        [maybeAuth, ...sizeFactorySubcallsDatas, maybeNullAuth].filter(Boolean),
      ]);
      return [
        ...erc20Subcalls,
        {
          target: this.sizeFactory,
          data: multicall,
        },
      ];
    }
  }
}
