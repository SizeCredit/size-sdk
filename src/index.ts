import {
  deposit,
  withdraw,
  buyCreditLimit,
  buyCreditMarket,
  buyCreditMarketWithCollection,
  sellCreditLimit,
  sellCreditMarket,
  sellCreditMarketWithCollection,
  liquidateWithReplacement,
  selfLiquidate,
  setUserConfiguration,
  copyLimitOrders,
} from "./actions/market";
import {
  subscribeToCollections,
  unsubscribeFromCollections,
} from "./actions/factory";
import { buildTx } from "./tx/build";
import { FullCopy, NoCopy, NullCopy } from "./constants";

export default {
  tx: {
    build: buildTx,
  },
  market: {
    deposit,
    withdraw,
    buyCreditLimit,
    buyCreditMarket,
    buyCreditMarketWithCollection,
    sellCreditLimit,
    sellCreditMarket,
    sellCreditMarketWithCollection,
    liquidateWithReplacement,
    selfLiquidate,
    setUserConfiguration,
    copyLimitOrders,
  },
  factory: {
    subscribeToCollections,
    unsubscribeFromCollections,
  },
  constants: {
    FullCopy,
    NoCopy,
    NullCopy,
  },
};
