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
  CopyLimitOrderConfigStructOutput,
} from "./types/ethers-contracts/Size";
import { BigNumber, BigNumberish, ethers } from "ethers";
import SizeABI from "./abi/Size.json";
import SizeFactoryABI from "./abi/SizeFactory.json";
import { SizeFactory } from "./config";

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

type FactoryFunctionName = "subscribeToCollections";

type Operation = {
  market: Address;
  functionName: MarketFunctionName;
  params: any;
};

type FactoryOperation = {
  factory: Address;
  functionName: FactoryFunctionName;
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

function copyLimitOrders(
  market: Address,
  params: CopyLimitOrdersParamsStruct,
): Operation {
  return {
    market,
    functionName: "copyLimitOrders",
    params,
  };
}

function subscribeToCollections(
  factory: Address,
  params: BigNumberish[],
): FactoryOperation {
  return {
    factory,
    functionName: "subscribeToCollections",
    params,
  };
}

interface TxArgs {
  target: Address;
  data: string;
}

function buildTx(operations: (Operation | FactoryOperation)[]): TxArgs {
  const subcalls = operations.map((op) => {
    if ("factory" in op) {
      const { factory, functionName, params } = op;
      const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
      const calldata = iSizeFactory.encodeFunctionData(functionName, [params]);
      return {
        target: factory,
        data: calldata,
      };
    } else {
      const iSize = new ethers.utils.Interface(SizeABI.abi);
      const { market, functionName, params } = op;
      const calldata = iSize.encodeFunctionData(functionName, [params]);
      return {
        target: market,
        data: calldata,
      };
    }
  });

  if (subcalls.length <= 1) {
    return subcalls[0];
  } else {
    const iSizeFactory = new ethers.utils.Interface(SizeFactoryABI.abi);
    const multicall = iSizeFactory.encodeFunctionData("multicall", [
      // FIXME: add auth
      subcalls.map((op) =>
        op.target === SizeFactory
          ? op.data
          : iSizeFactory.encodeFunctionData("callMarket", [op.target, op.data]),
      ),
    ]);
    return {
      target: SizeFactory as Address,
      data: multicall,
    };
  }
}

const FullCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: ethers.constants.MaxUint256,
  minAPR: BigNumber.from(0),
  maxAPR: ethers.constants.MaxUint256,
  offsetAPR: BigNumber.from(0),
} as CopyLimitOrderConfigStructOutput;

const NoCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: BigNumber.from(0),
  minAPR: BigNumber.from(0),
  maxAPR: BigNumber.from(0),
  offsetAPR: ethers.constants.MinInt256,
} as CopyLimitOrderConfigStructOutput;

const NullCopy: CopyLimitOrderConfigStructOutput = {
  minTenor: BigNumber.from(0),
  maxTenor: BigNumber.from(0),
  minAPR: BigNumber.from(0),
  maxAPR: BigNumber.from(0),
  offsetAPR: BigNumber.from(0),
} as CopyLimitOrderConfigStructOutput;

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
  },
  structs: {
    FullCopy,
    NoCopy,
    NullCopy,
  },
};
