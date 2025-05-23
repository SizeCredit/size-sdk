import { ethers } from "ethers";

export default function selector(data: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data)).slice(2, 10);
}
