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

export type Operation = {
  market: Address;
  functionName: MarketFunctionName;
  params: any;
};

export function deposit(market: Address, params: DepositParamsStruct): Operation {
  return {
    market,
    functionName: "deposit",
    params,
  };
}

export function withdraw(market: Address, params: WithdrawParamsStruct): Operation {
  return {
    market,
    functionName: "withdraw",
    params,
  };
}

export function buyCreditLimit(
  market: Address,
  params: BuyCreditLimitParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditLimit",
    params,
  };
}

export function buyCreditMarket(
  market: Address,
  params: BuyCreditMarketParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditMarket",
    params,
  };
}

export function buyCreditMarketWithCollection(
  market: Address,
  params: BuyCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditMarketWithCollection",
    params,
  };
}

export function sellCreditLimit(
  market: Address,
  params: SellCreditLimitParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditLimit",
    params,
  };
}

export function sellCreditMarket(
  market: Address,
  params: SellCreditMarketParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditMarket",
    params,
  };
}

export function sellCreditMarketWithCollection(
  market: Address,
  params: SellCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditMarketWithCollection",
    params,
  };
}

export function liquidateWithReplacement(
  market: Address,
  params: LiquidateWithReplacementParamsStruct,
): Operation {
  return {
    market,
    functionName: "liquidateWithReplacement",
    params,
  };
}

export function selfLiquidate(
  market: Address,
  params: SelfLiquidateParamsStruct,
): Operation {
  return {
    market,
    functionName: "selfLiquidate",
    params,
  };
}

export function setUserConfiguration(
  market: Address,
  params: SetUserConfigurationParamsStruct,
): Operation {
  return {
    market,
    functionName: "setUserConfiguration",
    params,
  };
}

export function copyLimitOrders(
  market: Address,
  params: CopyLimitOrdersParamsStruct,
): Operation {
  return {
    market,
    functionName: "copyLimitOrders",
    params,
  };
} 