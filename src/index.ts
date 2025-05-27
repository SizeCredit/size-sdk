import { MarketActions } from "./v1.8/actions/market";
import { FactoryActions } from "./v1.8/actions/factory";
import { buildTx } from "./v1.8/tx/build";
import { FullCopy, NoCopy, NullCopy } from "./constants";
import deadline from "./helpers/deadline";
import { MarketOperation } from "./v1.8/actions/market";
import { FactoryOperation } from "./v1.8/actions/factory";
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

    if (params.version === "v1.8") {
      this.market = new MarketActions(this.markets);
      this.factory = new FactoryActions(
        this.sizeFactory,
        this.collectionManager,
      );
    } else {
      // v1.7 implementation will be added later
      throw new Error("v1.7 implementation not yet available");
    }
  }

  get tx(): {
    build: (
      onBehalfOf: Address,
      operations: (MarketOperation | FactoryOperation)[],
      recipient?: Address,
    ) => ReturnType<typeof buildTx>;
  } {
    if (this.version === "v1.8") {
      return {
        build: (
          onBehalfOf: Address,
          operations: (MarketOperation | FactoryOperation)[],
          recipient?: Address,
        ) => buildTx(this.sizeFactory, onBehalfOf, operations, recipient),
      };
    }
    throw new Error("v1.7 implementation not yet available");
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
