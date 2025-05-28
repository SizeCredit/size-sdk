import { Address } from "../../types";
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

export class MarketActions {
  constructor(private readonly markets: Address[]) {}

  deposit(
    market: Address,
    params: DepositParamsStruct,
  ): MarketOperation<DepositParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "deposit",
      params,
    };
  }

  withdraw(
    market: Address,
    params: WithdrawParamsStruct,
  ): MarketOperation<WithdrawParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "withdraw",
      params,
    };
  }

  buyCreditLimit(
    market: Address,
    params: BuyCreditLimitParamsStruct,
  ): MarketOperation<BuyCreditLimitParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "buyCreditLimit",
      params,
    };
  }

  buyCreditMarket(
    market: Address,
    params: BuyCreditMarketParamsStruct,
  ): MarketOperation<BuyCreditMarketParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "buyCreditMarket",
      params,
    };
  }

  sellCreditLimit(
    market: Address,
    params: SellCreditLimitParamsStruct,
  ): MarketOperation<SellCreditLimitParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "sellCreditLimit",
      params,
    };
  }

  sellCreditMarket(
    market: Address,
    params: SellCreditMarketParamsStruct,
  ): MarketOperation<SellCreditMarketParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "sellCreditMarket",
      params,
    };
  }

  liquidateWithReplacement(
    market: Address,
    params: LiquidateWithReplacementParamsStruct,
  ): MarketOperation<LiquidateWithReplacementParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "liquidateWithReplacement",
      params,
    };
  }

  selfLiquidate(
    market: Address,
    params: SelfLiquidateParamsStruct,
  ): MarketOperation<SelfLiquidateParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "selfLiquidate",
      params,
    };
  }

  setUserConfiguration(
    market: Address,
    params: SetUserConfigurationParamsStruct,
  ): MarketOperation<SetUserConfigurationParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "setUserConfiguration",
      params,
    };
  }

  copyLimitOrders(
    market: Address,
    params: CopyLimitOrdersParamsStruct,
  ): MarketOperation<CopyLimitOrdersParamsStruct> {
    this.validateMarket(market);
    return {
      market,
      functionName: "copyLimitOrders",
      params,
    };
  }

  private validateMarket(market: Address) {
    if (!this.markets.includes(market)) {
      throw new Error(`[@sizecredit/sdk] Invalid market address: ${market}`);
    }
  }
}
