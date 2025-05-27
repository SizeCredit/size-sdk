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
import {
  FactoryActions as FactoryActionsV1_7,
  FactoryOperation as FactoryOperationV1_7,
} from "./v1.7/actions/factory";
import { TxBuilder as TxBuilderV1_8 } from "./v1.8/tx/build";
import { TxBuilder as TxBuilderV1_7 } from "./v1.7/tx/build";

import { FullCopy, NoCopy, NullCopy } from "./constants";
import deadline from "./helpers/deadline";
import { Address } from "./types";

export interface TxArgs {
  target: Address;
  data: string;
}

type Version = "v1.7" | "v1.8";

interface SDKParamsCommon {
  sizeFactory: Address;
  markets: Address[];
}

interface SDKParamsV1_8 extends SDKParamsCommon {
  version: "v1.8";
  collectionManager: Address;
}

interface SDKParamsV1_7 extends SDKParamsCommon {
  version: "v1.7";
  collectionManager?: never;
}

type SDKParams = SDKParamsV1_7 | SDKParamsV1_8;

type MarketActionsByVersion<T extends Version> = T extends "v1.8"
  ? MarketActionsV1_8
  : MarketActionsV1_7;
type FactoryActionsByVersion<T extends Version> = T extends "v1.8"
  ? FactoryActionsV1_8
  : FactoryActionsV1_7;
type TxBuilderByVersion<T extends Version> = T extends "v1.8"
  ? TxBuilderV1_8
  : TxBuilderV1_7;

class SDK<T extends Version> {
  public readonly sizeFactory: Address;
  public readonly collectionManager: Address | undefined;
  public readonly markets: Address[];
  public readonly version: T;
  public readonly market: MarketActionsByVersion<T>;
  public readonly factory: FactoryActionsByVersion<T>;
  private readonly txBuilder: TxBuilderByVersion<T>;

  constructor(params: SDKParams & { version: T }) {
    this.sizeFactory = params.sizeFactory;
    this.markets = params.markets;
    this.version = params.version;

    if (params.version === "v1.8") {
      this.collectionManager = (params as SDKParamsV1_8).collectionManager;
      this.market = new MarketActionsV1_8(
        this.markets,
      ) as MarketActionsByVersion<T>;
      this.factory = new FactoryActionsV1_8(
        this.sizeFactory,
        this.collectionManager,
      ) as FactoryActionsByVersion<T>;
      this.txBuilder = new TxBuilderV1_8(
        this.sizeFactory,
      ) as TxBuilderByVersion<T>;
    } else {
      this.market = new MarketActionsV1_7(
        this.markets,
      ) as MarketActionsByVersion<T>;
      this.factory = new FactoryActionsV1_7(
        this.sizeFactory,
      ) as FactoryActionsByVersion<T>;
      this.txBuilder = new TxBuilderV1_7(
        this.sizeFactory,
      ) as TxBuilderByVersion<T>;
    }
  }

  get tx(): T extends "v1.8"
    ? {
        build: (
          onBehalfOf: Address,
          operations: (MarketOperationV1_8 | FactoryOperationV1_8)[],
          recipient?: Address,
        ) => TxArgs[];
      }
    : {
        build: (
          onBehalfOf: Address,
          operations: (MarketOperationV1_7 | FactoryOperationV1_7)[],
          recipient?: Address,
        ) => TxArgs[];
      } {
    return {
      build: (
        onBehalfOf: Address,
        operations: T extends "v1.8"
          ? (MarketOperationV1_8 | FactoryOperationV1_8)[]
          : (MarketOperationV1_7 | FactoryOperationV1_7)[],
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
