import {
  Size,
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
} from "./types/ethers-contracts/Size";
import { ethers } from "ethers";
import SizeABI from "./abi/Size.json";

type Address = `0x${string}`;

type FunctionName =
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
  | "setUserConfiguration";

type Operation = {
  market: Address;
  functionName: FunctionName;
  params: any;
};

function deposit(market: Address, params: DepositParamsStruct): Operation {
  return {
    market,
    functionName: "deposit",
    params,
  };
}

function withdraw(market: Address, params: WithdrawParamsStruct): Operation {
  return {
    market,
    functionName: "withdraw",
    params,
  };
}

function buyCreditLimit(
  market: Address,
  params: BuyCreditLimitParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditLimit",
    params,
  };
}

function buyCreditMarket(
  market: Address,
  params: BuyCreditMarketParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditMarket",
    params,
  };
}

function buyCreditMarketWithCollection(
  market: Address,
  params: BuyCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    functionName: "buyCreditMarketWithCollection",
    params,
  };
}

function sellCreditLimit(
  market: Address,
  params: SellCreditLimitParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditLimit",
    params,
  };
}

function sellCreditMarket(
  market: Address,
  params: SellCreditMarketParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditMarket",
    params,
  };
}

function sellCreditMarketWithCollection(
  market: Address,
  params: SellCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    functionName: "sellCreditMarketWithCollection",
    params,
  };
}

function liquidateWithReplacement(
  market: Address,
  params: LiquidateWithReplacementParamsStruct,
): Operation {
  return {
    market,
    functionName: "liquidateWithReplacement",
    params,
  };
}

function selfLiquidate(
  market: Address,
  params: SelfLiquidateParamsStruct,
): Operation {
  return {
    market,
    functionName: "selfLiquidate",
    params,
  };
}

function setUserConfiguration(
  market: Address,
  params: SetUserConfigurationParamsStruct,
): Operation {
  return {
    market,
    functionName: "setUserConfiguration",
    params,
  };
}

interface TxArgs {
  target: Address;
  data: string;
}

function buildTx(operations: Operation[]): TxArgs {
  const iface = new ethers.utils.Interface(SizeABI.abi);

  return operations
    .map((op) => {
      const { market, functionName, params } = op;
      const calldata = iface.encodeFunctionData(functionName, [params]);

      return {
        target: market,
        data: calldata,
      };
    })
    .reduce(
      (acc, curr) => {
        return {
          target: curr.target,
          data: acc.data + curr.data,
        };
      },
      { target: "" as Address, data: "" },
    );
}

export default {
  tx: {
    build: buildTx,
  },
  functions: {
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
  },
};
