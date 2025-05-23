import {
  DepositParamsStruct,
  WithdrawParamsStruct,
  BuyCreditLimitParamsStruct,
  BuyCreditMarketParamsStruct,
  BuyCreditMarketWithCollectionParamsStruct,
  SellCreditLimitParamsStruct,
  SellCreditMarketParamsStruct,
  SellCreditMarketWithCollectionParamsStruct,
  LiquidateWithReplacementParamsStruct,
  SelfLiquidateParamsStruct,
  SetUserConfigurationParamsStruct,
  CopyLimitOrdersParamsStruct,
} from "../types/ethers-contracts/Size";

type Address = `0x${string}`;

type MarketFunctionName =
  | "deposit"
  | "withdraw"
  | "buyCreditLimit"
  | "buyCreditMarket"
  | "buyCreditMarketWithCollection"
  | "sellCreditLimit"
  | "sellCreditMarket"
  | "sellCreditMarketWithCollection"
  | "liquidateWithReplacement"
  | "selfLiquidate"
  | "setUserConfiguration"
  | "copyLimitOrders";

export type MarketOperation = {
  market: Address;
  functionName: MarketFunctionName;
  params: any;
};

export function deposit(
  market: Address,
  params: DepositParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "deposit",
    params,
  };
}

export function withdraw(
  market: Address,
  params: WithdrawParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "withdraw",
    params,
  };
}

export function buyCreditLimit(
  market: Address,
  params: BuyCreditLimitParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "buyCreditLimit",
    params,
  };
}

export function buyCreditMarket(
  market: Address,
  params: BuyCreditMarketParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "buyCreditMarket",
    params,
  };
}

export function buyCreditMarketWithCollection(
  market: Address,
  params: BuyCreditMarketWithCollectionParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "buyCreditMarketWithCollection",
    params,
  };
}

export function sellCreditLimit(
  market: Address,
  params: SellCreditLimitParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "sellCreditLimit",
    params,
  };
}

export function sellCreditMarket(
  market: Address,
  params: SellCreditMarketParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "sellCreditMarket",
    params,
  };
}

export function sellCreditMarketWithCollection(
  market: Address,
  params: SellCreditMarketWithCollectionParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "sellCreditMarketWithCollection",
    params,
  };
}

export function liquidateWithReplacement(
  market: Address,
  params: LiquidateWithReplacementParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "liquidateWithReplacement",
    params,
  };
}

export function selfLiquidate(
  market: Address,
  params: SelfLiquidateParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "selfLiquidate",
    params,
  };
}

export function setUserConfiguration(
  market: Address,
  params: SetUserConfigurationParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "setUserConfiguration",
    params,
  };
}

export function copyLimitOrders(
  market: Address,
  params: CopyLimitOrdersParamsStruct,
): MarketOperation {
  return {
    market,
    functionName: "copyLimitOrders",
    params,
  };
}
