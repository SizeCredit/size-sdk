import { MarketActions } from "./actions/market";
import { FactoryActions } from "./actions/factory";
import { buildTx } from "./tx/build";
import { FullCopy, NoCopy, NullCopy } from "./constants";
import deadline from "./helpers/deadline";
import { MarketOperation } from "./actions/market";
import { FactoryOperation } from "./actions/factory";
import { Address } from "./types";

interface SDKParams {
  sizeFactory: Address;
  collectionManager: Address;
  markets: Address[];
  version: "v1.7" | "v1.8";
}

class SDK {
  public readonly sizeFactory: Address;
  public readonly collectionManager: Address;
  public readonly markets: Address[];
  public readonly version: "v1.7" | "v1.8";
  public readonly market: MarketActions;
  public readonly factory: FactoryActions;

  constructor(params: SDKParams) {
    this.sizeFactory = params.sizeFactory;
    this.collectionManager = params.collectionManager;
    this.markets = params.markets;
    this.version = params.version;
    this.market = new MarketActions(this.markets);
    this.factory = new FactoryActions(this.sizeFactory, this.collectionManager);
  }

  get tx(): {
    build: (
      onBehalfOf: Address,
      operations: (MarketOperation | FactoryOperation)[],
      recipient?: Address,
    ) => ReturnType<typeof buildTx>;
  } {
    return {
      build: (
        onBehalfOf: Address,
        operations: (MarketOperation | FactoryOperation)[],
        recipient?: Address,
      ) => buildTx(this.sizeFactory, onBehalfOf, operations, recipient),
    };
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
