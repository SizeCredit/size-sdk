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

type Operation = {
  market: Address;
  type: string;
  params: any;
};

function deposit(market: Address, params: DepositParamsStruct): Operation {
  return {
    market,
    type: "deposit",
    params,
  };
}

function depositOnBehalfOf(
  market: Address,
  params: DepositParamsStruct & { onBehalfOf: Address },
): Operation {
  return {
    market,
    type: "depositOnBehalfOf",
    params,
  };
}

function withdraw(market: Address, params: WithdrawParamsStruct): Operation {
  return {
    market,
    type: "withdraw",
    params,
  };
}

function withdrawOnBehalfOf(
  market: Address,
  params: WithdrawParamsStruct & { onBehalfOf: Address },
): Operation {
  return {
    market,
    type: "withdrawOnBehalfOf",
    params,
  };
}

function buyCreditLimit(
  market: Address,
  params: BuyCreditLimitParamsStruct,
): Operation {
  return {
    market,
    type: "buyCreditLimit",
    params,
  };
}

function buyCreditMarket(
  market: Address,
  params: BuyCreditMarketParamsStruct,
): Operation {
  return {
    market,
    type: "buyCreditMarket",
    params,
  };
}

function buyCreditMarketWithCollection(
  market: Address,
  params: BuyCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    type: "buyCreditMarketWithCollection",
    params,
  };
}

function sellCreditLimit(
  market: Address,
  params: SellCreditLimitParamsStruct,
): Operation {
  return {
    market,
    type: "sellCreditLimit",
    params,
  };
}

function sellCreditMarket(
  market: Address,
  params: SellCreditMarketParamsStruct,
): Operation {
  return {
    market,
    type: "sellCreditMarket",
    params,
  };
}

function sellCreditMarketWithCollection(
  market: Address,
  params: SellCreditMarketWithCollectionParamsStruct,
): Operation {
  return {
    market,
    type: "sellCreditMarketWithCollection",
    params,
  };
}

function liquidateWithReplacement(
  market: Address,
  params: LiquidateWithReplacementParamsStruct,
): Operation {
  return {
    market,
    type: "liquidateWithReplacement",
    params,
  };
}

function selfLiquidate(
  market: Address,
  params: SelfLiquidateParamsStruct,
): Operation {
  return {
    market,
    type: "selfLiquidate",
    params,
  };
}

function setUserConfiguration(
  market: Address,
  params: SetUserConfigurationParamsStruct,
): Operation {
  return {
    market,
    type: "setUserConfiguration",
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
      const { market, type, params } = op;
      let calldata: string;

      switch (type) {
        case "deposit":
          calldata = iface.encodeFunctionData("deposit", [params]);
          break;
        case "withdraw":
          calldata = iface.encodeFunctionData("withdraw", [params]);
          break;
        case "depositOnBehalfOf":
          calldata = iface.encodeFunctionData("depositOnBehalfOf", [params]);
          break;
        case "withdrawOnBehalfOf":
          calldata = iface.encodeFunctionData("withdrawOnBehalfOf", [params]);
          break;
        case "buyCreditLimit":
          calldata = iface.encodeFunctionData("buyCreditLimit", [params]);
          break;
        case "buyCreditMarket":
          calldata = iface.encodeFunctionData("buyCreditMarket", [params]);
          break;
        case "buyCreditMarketWithCollection":
          calldata = iface.encodeFunctionData("buyCreditMarketWithCollection", [
            params,
          ]);
          break;
        case "sellCreditLimit":
          calldata = iface.encodeFunctionData("sellCreditLimit", [params]);
          break;
        case "sellCreditMarket":
          calldata = iface.encodeFunctionData("sellCreditMarket", [params]);
          break;
        case "sellCreditMarketWithCollection":
          calldata = iface.encodeFunctionData(
            "sellCreditMarketWithCollection",
            [params],
          );
          break;
        case "liquidateWithReplacement":
          calldata = iface.encodeFunctionData("liquidateWithReplacement", [
            params,
          ]);
          break;
        case "selfLiquidate":
          calldata = iface.encodeFunctionData("selfLiquidate", [params]);
          break;
        case "setUserConfiguration":
          calldata = iface.encodeFunctionData("setUserConfiguration", [params]);
          break;
        default:
          throw new Error(`Unknown operation type: ${type}`);
      }

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
  buildTx,
  deposit,
  depositOnBehalfOf,
  withdraw,
  withdrawOnBehalfOf,
  buyCreditLimit,
  buyCreditMarket,
  buyCreditMarketWithCollection,
  sellCreditLimit,
  sellCreditMarket,
  sellCreditMarketWithCollection,
  liquidateWithReplacement,
  selfLiquidate,
  setUserConfiguration,
};
