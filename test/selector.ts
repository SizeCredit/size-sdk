import { Interface } from "@ethersproject/abi";
import { ethers } from "ethers";

export default function selector(
  s: string | Interface,
  functionName?: string,
): string {
  if (typeof s === "string") {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(s)).substring(2, 10);
  } else {
    return s.getSighash(s.getFunction(functionName!)).substring(2, 10);
  }
}
