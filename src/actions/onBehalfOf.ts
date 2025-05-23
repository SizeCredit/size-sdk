import { Action, FunctionNameToAction } from "../Authorization";
import {
  DepositOnBehalfOfParamsStruct,
  SetUserConfigurationOnBehalfOfParamsStruct,
  CopyLimitOrdersOnBehalfOfParamsStruct,
  SelfLiquidateOnBehalfOfParamsStruct,
  SellCreditMarketOnBehalfOfParamsStruct,
  SellCreditLimitOnBehalfOfParamsStruct,
  BuyCreditMarketOnBehalfOfParamsStruct,
  BuyCreditLimitOnBehalfOfParamsStruct,
  WithdrawOnBehalfOfParamsStruct,
} from "../types/ethers-contracts/Size";
import { MarketFunctionName, MarketOperationParams } from "./market";

type Address = `0x${string}`;

export type OnBehalfOfFunctionName =
  | "depositOnBehalfOf"
  | "withdrawOnBehalfOf"
  | "buyCreditLimitOnBehalfOf"
  | "buyCreditMarketOnBehalfOf"
  | "sellCreditLimitOnBehalfOf"
  | "sellCreditMarketOnBehalfOf"
  | "selfLiquidateOnBehalfOf"
  | "setUserConfigurationOnBehalfOf"
  | "copyLimitOrdersOnBehalfOf";

export const MarketFunctionNameToOnBehalfOfFunctionName: Record<
  Exclude<
    MarketFunctionName,
    | "repay"
    | "liquidate"
    | "liquidateWithReplacement"
    | "buyCreditMarketWithCollection"
    | "sellCreditMarketWithCollection"
  >,
  OnBehalfOfFunctionName
> = {
  deposit: "depositOnBehalfOf",
  withdraw: "withdrawOnBehalfOf",
  buyCreditLimit: "buyCreditLimitOnBehalfOf",
  buyCreditMarket: "buyCreditMarketOnBehalfOf",
  sellCreditLimit: "sellCreditLimitOnBehalfOf",
  sellCreditMarket: "sellCreditMarketOnBehalfOf",
  selfLiquidate: "selfLiquidateOnBehalfOf",
  setUserConfiguration: "setUserConfigurationOnBehalfOf",
  copyLimitOrders: "copyLimitOrdersOnBehalfOf",
};

export type OnBehalfOfOperationParams =
  | DepositOnBehalfOfParamsStruct
  | WithdrawOnBehalfOfParamsStruct
  | BuyCreditLimitOnBehalfOfParamsStruct
  | BuyCreditMarketOnBehalfOfParamsStruct
  | SellCreditLimitOnBehalfOfParamsStruct
  | SellCreditMarketOnBehalfOfParamsStruct
  | SelfLiquidateOnBehalfOfParamsStruct
  | SetUserConfigurationOnBehalfOfParamsStruct
  | CopyLimitOrdersOnBehalfOfParamsStruct;

export type OnBehalfOfOperation<
  T extends OnBehalfOfOperationParams = OnBehalfOfOperationParams,
> = {
  market: Address;
  functionName: OnBehalfOfFunctionName;
  action: Action;
  externalParams: T;
};

export function depositOnBehalfOf(
  market: Address,
  externalParams: DepositOnBehalfOfParamsStruct,
): OnBehalfOfOperation<DepositOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "depositOnBehalfOf",
    action: FunctionNameToAction["deposit"],
    externalParams,
  };
}

export function withdrawOnBehalfOf(
  market: Address,
  externalParams: WithdrawOnBehalfOfParamsStruct,
): OnBehalfOfOperation<WithdrawOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "withdrawOnBehalfOf",
    action: FunctionNameToAction["withdraw"],
    externalParams,
  };
}

export function buyCreditLimitOnBehalfOf(
  market: Address,
  externalParams: BuyCreditLimitOnBehalfOfParamsStruct,
): OnBehalfOfOperation<BuyCreditLimitOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "buyCreditLimitOnBehalfOf",
    action: FunctionNameToAction["buyCreditLimit"],
    externalParams,
  };
}

export function buyCreditMarketOnBehalfOf(
  market: Address,
  externalParams: BuyCreditMarketOnBehalfOfParamsStruct,
): OnBehalfOfOperation<BuyCreditMarketOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "buyCreditMarketOnBehalfOf",
    action: FunctionNameToAction["buyCreditMarket"],
    externalParams,
  };
}

export function sellCreditLimitOnBehalfOf(
  market: Address,
  externalParams: SellCreditLimitOnBehalfOfParamsStruct,
): OnBehalfOfOperation<SellCreditLimitOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "sellCreditLimitOnBehalfOf",
    action: FunctionNameToAction["sellCreditLimit"],
    externalParams,
  };
}

export function sellCreditMarketOnBehalfOf(
  market: Address,
  externalParams: SellCreditMarketOnBehalfOfParamsStruct,
): OnBehalfOfOperation<SellCreditMarketOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "sellCreditMarketOnBehalfOf",
    action: FunctionNameToAction["sellCreditMarket"],
    externalParams,
  };
}

export function selfLiquidateOnBehalfOf(
  market: Address,
  externalParams: SelfLiquidateOnBehalfOfParamsStruct,
): OnBehalfOfOperation<SelfLiquidateOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "selfLiquidateOnBehalfOf",
    action: FunctionNameToAction["selfLiquidate"],
    externalParams,
  };
}

export function setUserConfigurationOnBehalfOf(
  market: Address,
  externalParams: SetUserConfigurationOnBehalfOfParamsStruct,
): OnBehalfOfOperation<SetUserConfigurationOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "setUserConfigurationOnBehalfOf",
    action: FunctionNameToAction["setUserConfiguration"],
    externalParams,
  };
}

export function copyLimitOrdersOnBehalfOf(
  market: Address,
  externalParams: CopyLimitOrdersOnBehalfOfParamsStruct,
): OnBehalfOfOperation<CopyLimitOrdersOnBehalfOfParamsStruct> {
  return {
    market,
    functionName: "copyLimitOrdersOnBehalfOf",
    action: FunctionNameToAction["copyLimitOrders"],
    externalParams,
  };
}

export function onBehalfOfOperation(
  market: Address,
  functionName: MarketFunctionName,
  params: MarketOperationParams,
  onBehalfOf: Address,
  recipient?: Address,
): OnBehalfOfOperation<OnBehalfOfOperationParams> | undefined {
  const onBehalfOfFunctionName: OnBehalfOfFunctionName | undefined =
    MarketFunctionNameToOnBehalfOfFunctionName[
      functionName as keyof typeof MarketFunctionNameToOnBehalfOfFunctionName
    ];
  if (!onBehalfOfFunctionName) {
    return undefined;
  } else {
    return {
      market,
      functionName: onBehalfOfFunctionName,
      action: FunctionNameToAction[functionName],
      externalParams: {
        params,
        onBehalfOf,
        recipient: recipient ?? onBehalfOf,
      } as OnBehalfOfOperationParams,
    };
  }
}
