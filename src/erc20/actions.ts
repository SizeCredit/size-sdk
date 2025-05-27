import { BigNumberish } from "ethers";
import { Address } from "../types";

export interface ERC20Operation {
  token: Address;
  functionName: "approve";
  params: [Address, BigNumberish];
}

export class ERC20Actions {
  constructor() {}

  approve(
    token: Address,
    spender: Address,
    amount: BigNumberish,
  ): ERC20Operation {
    return {
      token,
      functionName: "approve",
      params: [spender, amount],
    };
  }
}
