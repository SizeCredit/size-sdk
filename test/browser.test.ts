import { JSDOM } from "jsdom";
import path from "path";
import { describe, expect, test, beforeAll } from "@jest/globals";
import SizeSDK from "../src/index";
import { BigNumber } from "ethers";

describe("size-sdk browser build", () => {
  let window: any;
  let sdk: typeof SizeSDK;

  beforeAll(() => {
    const html = "<!DOCTYPE html><html><body></body></html>";
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    window = dom.window;
    window.ethereum = {};

    const distPath = path.resolve(__dirname, "../src/index.js");
    const sizeModule = require(distPath);
    sdk = sizeModule.default || sizeModule;
    window.sdk = sdk;
  });

  test("should expose size factory on window", () => {
    expect(window.sdk).toBeInstanceOf(Object);
  });

  test("size.tx.build should return converted output", async () => {
    const data = sdk.tx.build([
      sdk.functions.deposit("0x123", {
        amount: "100",
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(data.target).toBe("0x123");
    expect(data.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigInt", async () => {
    const data = sdk.tx.build([
      sdk.functions.deposit("0x123", {
        amount: BigInt(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(data.target).toBe("0x123");
    expect(data.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept bigint", async () => {
    const data = sdk.tx.build([
      sdk.functions.deposit("0x123", {
        amount: 100n,
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(data.target).toBe("0x123");
    expect(data.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigNumber", async () => {
    const data = sdk.tx.build([
      sdk.functions.deposit("0x123", {
        amount: BigNumber.from(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(data.target).toBe("0x123");
    expect(data.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });
});
