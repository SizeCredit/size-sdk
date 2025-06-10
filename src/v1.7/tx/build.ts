import { BigNumber, BigNumberish, ethers } from "ethers";
import SizeABI from "../abi/Size.json";
import ERC20ABI from "../../erc20/abi/ERC20.json";
import { MarketOperation } from "../actions/market";
import { TxArgs, Address } from "../../index";
import { ERC20Operation } from "../../erc20/actions";

function isMarketOperation(
  operation: MarketOperation | ERC20Operation,
): operation is MarketOperation {
  return "market" in operation;
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

    const toBigNumber = (v?: BigNumberish) =>
      v === undefined ? BigNumber.from(0) : BigNumber.from(v);

    type Group =
      | { type: "market"; market: Address; operations: MarketOperation[] }
      | { type: "erc20"; operation: ERC20Operation };

    const groups = operations.reduce<Group[]>((acc, op) => {
      const last = acc[acc.length - 1];
      if (isMarketOperation(op)) {
        if (
          last &&
          last.type === "market" &&
          last.market === op.market
        ) {
          last.operations.push(op);
        } else {
          acc.push({ type: "market", market: op.market, operations: [op] });
        }
      } else {
        acc.push({ type: "erc20", operation: op });
      }
      return acc;
    }, []);

    return groups.map((group) => {
      if (group.type === "erc20") {
        const { token, functionName, params } = group.operation;
        const calldata = this.IERC20.encodeFunctionData(functionName, params);
        return { target: token, data: calldata, value: undefined } as TxArgs;
      }

      const market = group.market;
      if (group.operations.length === 1) {
        const { functionName, params, value } = group.operations[0];
        const calldata = this.ISize.encodeFunctionData(functionName, [params]);
        return { target: market, data: calldata, value } as TxArgs;
      }

      const calldatas = group.operations.map((g) =>
        this.ISize.encodeFunctionData(g.functionName, [g.params])
      );
      const totalValue = group.operations
        .map((g) => toBigNumber(g.value))
        .reduce((a, b) => a.add(b), BigNumber.from(0));
      const calldata = this.ISize.encodeFunctionData("multicall", [calldatas]);
      return {
        target: market,
        data: calldata,
        value: totalValue.isZero() ? undefined : totalValue,
      } as TxArgs;
    });
  }
}
