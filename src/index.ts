import {
  MarketActions as MarketActionsV1_8,
  MarketOperation as MarketOperationV1_8,
} from "./v1.8/actions/market";
import {
  FactoryActions as FactoryActionsV1_8,
  FactoryOperation as FactoryOperationV1_8,
} from "./v1.8/actions/factory";
import {
  MarketActions as MarketActionsV1_7,
  MarketOperation as MarketOperationV1_7,
} from "./v1.7/actions/market";
import { TxBuilder as TxBuilderV1_8 } from "./v1.8/tx/build";
import { TxBuilder as TxBuilderV1_7 } from "./v1.7/tx/build";

import { FullCopy, NoCopy, NullCopy } from "./constants";
import deadline from "./helpers/deadline";
import { Address } from "./types";
import { ERC20Actions, ERC20Operation } from "./erc20/actions";

export interface TxArgs {
  target: Address;
  data: string;
}

type Version = "v1.7" | "v1.8";

interface SDKParamsCommon {
  markets: Address[];
}

interface SDKParamsV1_8 extends SDKParamsCommon {
  version: "v1.8";
  sizeFactory: Address;
}

interface SDKParamsV1_7 extends SDKParamsCommon {
  version: "v1.7";
  sizeFactory?: never;
}

type SDKParams = SDKParamsV1_7 | SDKParamsV1_8;

type MarketActionsByVersion<T extends Version> = T extends "v1.8"
  ? MarketActionsV1_8
  : MarketActionsV1_7;
type FactoryActionsByVersion<T extends Version> = T extends "v1.8"
  ? FactoryActionsV1_8
  : never;
type TxBuilderByVersion<T extends Version> = T extends "v1.8"
  ? TxBuilderV1_8
  : TxBuilderV1_7;

class SDK<T extends Version> {
  public readonly sizeFactory: Address | undefined;

  public readonly markets: Address[];
  public readonly version: T;

  public readonly market: MarketActionsByVersion<T>;
  public readonly factory: FactoryActionsByVersion<T>;
  public readonly erc20: ERC20Actions;

  private readonly txBuilder: TxBuilderByVersion<T>;

  constructor(params: SDKParams & { version: T }) {
    this.markets = params.markets;
    this.version = params.version;
    this.erc20 = new ERC20Actions();

    if (params.version === "v1.8") {
      this.sizeFactory = (params as SDKParamsV1_8).sizeFactory;

      this.factory = new FactoryActionsV1_8() as FactoryActionsByVersion<T>;
      this.market = new MarketActionsV1_8(
        this.markets,
      ) as MarketActionsByVersion<T>;

      this.txBuilder = new TxBuilderV1_8(
        this.sizeFactory,
      ) as TxBuilderByVersion<T>;
    } else {
      this.factory = undefined as unknown as FactoryActionsByVersion<T>;
      this.market = new MarketActionsV1_7(
        this.markets,
      ) as MarketActionsByVersion<T>;

      this.txBuilder = new TxBuilderV1_7() as TxBuilderByVersion<T>;
    }
  }

  get tx(): T extends "v1.8"
    ? {
        build: (
          onBehalfOf: Address,
          operations: (
            | MarketOperationV1_8
            | FactoryOperationV1_8
            | ERC20Operation
          )[],
          recipient?: Address,
        ) => TxArgs[];
      }
    : {
        build: (
          onBehalfOf: Address,
          operations: (MarketOperationV1_7 | ERC20Operation)[],
          recipient?: Address,
        ) => TxArgs[];
      } {
    return {
      build: (
        onBehalfOf: Address,
        operations: T extends "v1.8"
          ? (MarketOperationV1_8 | FactoryOperationV1_8 | ERC20Operation)[]
          : (MarketOperationV1_7 | ERC20Operation)[],
        recipient?: Address,
      ) => this.txBuilder.build(onBehalfOf, operations as any, recipient),
    } as any;
  }

  get helpers() {
    return {
      deadline,
    };
  }

  get constants() {
    return {
      FullCopy,
      NoCopy,
      NullCopy,
    };
  }
}

export default SDK;
