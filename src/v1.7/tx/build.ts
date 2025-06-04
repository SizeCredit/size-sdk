import { ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import ERC20ABI from "../../erc20/abi/ERC20.json";
import { MarketOperation } from "../actions/market";
import { Address } from "../../types";
import { TxArgs } from "../../index";
import { ERC20Operation } from "../../erc20/actions";

function isMarketOperation(
  operation: MarketOperation | ERC20Operation,
): operation is MarketOperation {
  return "market" in operation;
}

function isERC20Operation(
  operation: MarketOperation | ERC20Operation,
): operation is ERC20Operation {
  return "functionName" in operation && operation.functionName === "approve";
}

export class TxBuilder {
  private readonly ISize: ethers.utils.Interface;
  private readonly IERC20: ethers.utils.Interface;

  constructor() {
    this.ISize = new ethers.utils.Interface(SizeABI.abi);
    this.IERC20 = new ethers.utils.Interface(ERC20ABI.abi);
  }

  build(
    onBehalfOf: Address,
    operations: (MarketOperation | ERC20Operation)[],
    recipient?: Address,
  ): TxArgs[] {
    if (operations.length === 0) {
      throw new Error("[@sizecredit/sdk] no operations to execute");
    }

    return operations.map((operation) => {
      if (isMarketOperation(operation)) {
        const { market, functionName, params } = operation;
        const calldata = this.ISize.encodeFunctionData(functionName, [params]);
        return {
          target: market,
          data: calldata,
        };
      } else {
        const { token, functionName, params } = operation;
        const calldata = this.IERC20.encodeFunctionData(functionName, params);
        return {
          target: token,
          data: calldata,
        };
      }
    });
  }
}
