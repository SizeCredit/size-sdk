import { describe, it, expect } from "@jest/globals";
import SDK from "../src";

describe("SDK v1.7", () => {
  it("should throw error when initializing v1.7 SDK", () => {
    expect(() => {
      new SDK({
        sizeFactory: "0x0000000000000000000000000000000000000000",
        collectionManager: "0x0000000000000000000000000000000000000000",
        markets: ["0x0000000000000000000000000000000000000000"],
        version: "v1.7",
      });
    }).toThrow("v1.7 implementation not yet available");
  });
});
