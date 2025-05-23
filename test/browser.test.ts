import { JSDOM } from "jsdom";
import path from "path";
import { describe, expect, test, beforeAll } from "@jest/globals";
import SizeSDK from "../src/index";
import { BigNumber } from "ethers";
import { SizeFactory } from "../src/config";
import selector from "./selector";

describe("size-sdk browser build", () => {
  let window: any;
  let sdk: typeof SizeSDK;

  const market1 = "0x0000000000000000000000000000000000000123";
  const market2 = "0x0000000000000000000000000000000000000456";

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
    const tx = sdk.tx.build([
      sdk.market.deposit(market1, {
        amount: "100",
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(tx.target).toBe(market1);
    expect(tx.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigInt", async () => {
    const tx = sdk.tx.build([
      sdk.market.deposit(market1, {
        amount: BigInt(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(tx.target).toBe(market1);
    expect(tx.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept bigint", async () => {
    const tx = sdk.tx.build([
      sdk.market.deposit(market1, {
        amount: 100n,
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(tx.target).toBe(market1);
    expect(tx.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigNumber", async () => {
    const tx = sdk.tx.build([
      sdk.market.deposit(market1, {
        amount: BigNumber.from(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(tx.target).toBe(market1);
    expect(tx.data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build subscribeToCollections, unsubscribeFromCollections", async () => {
    const tx = sdk.tx.build([
      sdk.factory.subscribeToCollections([42n]),
      sdk.factory.unsubscribeFromCollections([13n]),
    ]);
    expect(tx.target).toBe(SizeFactory);
    expect(tx.data).not.toContain(selector("setAuthorization(address,uint256)"));
    expect(tx.data).toBe(
      "0xac9650d800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000064c8fb624700000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000649e42bfa300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000d00000000000000000000000000000000000000000000000000000000",
    );
  });

  test("ideal flow", async () => {
    const tx = sdk.tx.build([
      sdk.market.setUserConfiguration(market2, {
        vault: "0x000000000000000000000000000000000000eeee",
        openingLimitBorrowCR: 0,
        allCreditPositionsForSaleDisabled: false,
        creditPositionIdsForSale: false,
        creditPositionIds: [],
      }),
      sdk.market.deposit(market1, {
        amount: BigNumber.from(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
      sdk.market.copyLimitOrders(market1, {
        copyLoanOfferConfig: sdk.constants.FullCopy,
        copyBorrowOfferConfig: sdk.constants.FullCopy,
      }),
      sdk.factory.subscribeToCollections([42n]),
    ]);
    expect(tx.target).toBe(SizeFactory);
    expect(tx.data).toBe(
      "0x",
    );
  });
});
