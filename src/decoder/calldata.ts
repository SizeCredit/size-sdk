import { ethers } from "ethers";
import SizeFactoryV1_8 from "../v1.8/abi/SizeFactory.json";
import SizeFactoryV1_7 from "../v1.7/abi/SizeFactory.json";
import SizeV1_7 from "../v1.7/abi/Size.json";
import SizeV1_8 from "../v1.8/abi/Size.json";
import CollectionsManagerV1_8 from "../v1.8/abi/CollectionsManager.json";
import ERC20 from "../erc20/abi/ERC20.json";
import { Result } from "@ethersproject/abi";

export class CalldataDecoder {
  private readonly iface: ethers.utils.Interface;

  constructor() {
    const set = new Set();
    const abi = [
      ...CollectionsManagerV1_8.abi,
      ...SizeFactoryV1_8.abi,
      ...SizeFactoryV1_7.abi,
      ...SizeV1_7.abi,
      ...SizeV1_8.abi,
      ...ERC20.abi,
    ];

    const deduped = abi
      .filter((item) => item.type === "function")
      .filter((item) => {
        const sig = `${item.name}(${item.inputs.map((input) => input.type).join(",")})`;
        if (set.has(sig)) return false;
        set.add(sig);
        return true;
      });

    this.iface = new ethers.utils.Interface(deduped);
  }

  decode(data: string): string {
    try {
      const tx = this.iface.parseTransaction({ data });
      return this.recursiveFormat(
        tx.name,
        tx.args,
        tx.functionFragment.inputs,
        0,
      );
    } catch {
      return "Unknown function call or invalid calldata";
    }
  }

  private recursiveFormat(
    name: string,
    args: Result,
    inputs: ethers.utils.ParamType[],
    level: number,
  ): string {
    const indent = (lvl: number) => "  ".repeat(lvl);

    const formattedArgs = args.map((arg, i) => {
      const input = inputs[i];

      if (
        input.type === "bytes" &&
        typeof arg === "string" &&
        arg.startsWith("0x")
      ) {
        return this.tryDecodeNested(arg, level + 1);
      }

      if (input.type === "bytes[]" && Array.isArray(arg)) {
        const inner = arg.map((innerData: string) =>
          this.tryDecodeNested(innerData, level + 2),
        );
        return (
          "[\n" +
          indent(level + 2) +
          inner.join(",\n" + indent(level + 2)) +
          "\n" +
          indent(level + 1) +
          "]"
        );
      }

      if (Array.isArray(arg)) {
        return "[" + arg.map((item: any) => item.toString()).join(", ") + "]";
      }

      return arg.toString();
    });

    return `${name}(\n${indent(level + 1)}${formattedArgs.join(",\n" + indent(level + 1))}\n${indent(level)})`;
  }

  private tryDecodeNested(data: string, level: number): string {
    try {
      const nested = this.iface.parseTransaction({ data });
      return this.recursiveFormat(
        nested.name,
        nested.args,
        nested.functionFragment.inputs,
        level,
      );
    } catch {
      return data;
    }
  }
}
