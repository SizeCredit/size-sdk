import { ethers } from "ethers";
import ErrorsV1_8 from "../v1.8/abi/Errors.json";
import ErrorsV1_7 from "../v1.7/abi/Errors.json";
import CollectionsManagerV1_8 from "../v1.8/abi/CollectionsManager.json";
import IERC20Errors from "../erc20/abi/IERC20Errors.json";
import selector from "../helpers/selector";

export class ErrorDecoder {
  constructor() {}

  decode(data: string): string {
    if (data.startsWith(`0x${selector("Error(string)")}`)) {
      const [decoded] = ethers.utils.defaultAbiCoder.decode(
        ["string"],
        "0x" + data.substring(10),
      );
      return decoded;
    } else if (data.startsWith(`0x${selector("Panic(uint256)")}`)) {
      const [decoded] = ethers.utils.defaultAbiCoder.decode(
        ["uint256"],
        "0x" + data.substring(10),
      );
      return decoded;
    } else {
      const abi = [
        ...ErrorsV1_8.abi,
        ...ErrorsV1_7.abi,
        ...CollectionsManagerV1_8.abi,
        ...IERC20Errors.abi,
      ];
      const contract = new ethers.utils.Interface(abi);
      const decodedError = contract.parseError(data);
      const stringifyError = (decodedError: any) => {
        const args = decodedError.args
          .map((arg: any) => {
            return typeof arg === "object" ? arg.toString() : arg;
          })
          .join(",");
        return `${decodedError.name}(${args})`;
      };

      return stringifyError(decodedError);
    }
  }
}
