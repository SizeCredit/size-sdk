import { Address } from "../types";
import {
  DepositParamsStruct,
  WithdrawParamsStruct,
  BuyCreditLimitParamsStruct,
  BuyCreditMarketParamsStruct,
  SellCreditLimitParamsStruct,
  SellCreditMarketParamsStruct,
  LiquidateWithReplacementParamsStruct,
  SelfLiquidateParamsStruct,
  SetUserConfigurationParamsStruct,
  CopyLimitOrdersParamsStruct,
} from "../types/ethers-contracts/Size";

export type MarketFunctionName =
  | "deposit"
  | "withdraw"
  | "buyCreditLimit"
  | "buyCreditMarket"
  | "sellCreditLimit"
  | "sellCreditMarket"
  | "liquidateWithReplacement"
  | "selfLiquidate"
  | "setUserConfiguration"
  | "copyLimitOrders";

export type MarketOperationParams =
  | DepositParamsStruct
  | WithdrawParamsStruct
  | BuyCreditLimitParamsStruct
  | BuyCreditMarketParamsStruct
  | SellCreditLimitParamsStruct
  | SellCreditMarketParamsStruct
  | LiquidateWithReplacementParamsStruct
  | SelfLiquidateParamsStruct
  | SetUserConfigurationParamsStruct
  | CopyLimitOrdersParamsStruct;

export type MarketOperation<
  T extends MarketOperationParams = MarketOperationParams,
> = {
  market: Address;
  functionName: MarketFunctionName;
  params: T;
};

export function deposit(
  market: Address,
  params: DepositParamsStruct,
): MarketOperation<DepositParamsStruct> {
  return {
    market,
    functionName: "deposit",
    params,
  };
}

export function withdraw(
  market: Address,
  params: WithdrawParamsStruct,
): MarketOperation<WithdrawParamsStruct> {
  return {
    market,
    functionName: "withdraw",
    params,
  };
}

export function buyCreditLimit(
  market: Address,
  params: BuyCreditLimitParamsStruct,
): MarketOperation<BuyCreditLimitParamsStruct> {
  return {
    market,
    functionName: "buyCreditLimit",
    params,
  };
}

export function buyCreditMarket(
  market: Address,
  params: BuyCreditMarketParamsStruct,
): MarketOperation<BuyCreditMarketParamsStruct> {
  return {
    market,
    functionName: "buyCreditMarket",
    params,
  };
}

export function sellCreditLimit(
  market: Address,
  params: SellCreditLimitParamsStruct,
): MarketOperation<SellCreditLimitParamsStruct> {
  return {
    market,
    functionName: "sellCreditLimit",
    params,
  };
}

export function sellCreditMarket(
  market: Address,
  params: SellCreditMarketParamsStruct,
): MarketOperation<SellCreditMarketParamsStruct> {
  return {
    market,
    functionName: "sellCreditMarket",
    params,
  };
}

export function liquidateWithReplacement(
  market: Address,
  params: LiquidateWithReplacementParamsStruct,
): MarketOperation<LiquidateWithReplacementParamsStruct> {
  return {
    market,
    functionName: "liquidateWithReplacement",
    params,
  };
}

export function selfLiquidate(
  market: Address,
  params: SelfLiquidateParamsStruct,
): MarketOperation<SelfLiquidateParamsStruct> {
  return {
    market,
    functionName: "selfLiquidate",
    params,
  };
}

export function setUserConfiguration(
  market: Address,
  params: SetUserConfigurationParamsStruct,
): MarketOperation<SetUserConfigurationParamsStruct> {
  return {
    market,
    functionName: "setUserConfiguration",
    params,
  };
}

export function copyLimitOrders(
  market: Address,
  params: CopyLimitOrdersParamsStruct,
): MarketOperation<CopyLimitOrdersParamsStruct> {
  return {
    market,
    functionName: "copyLimitOrders",
    params,
  };
}
