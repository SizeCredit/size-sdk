import { JSDOM } from "jsdom";
import { describe, expect, test, beforeAll } from "@jest/globals";
import SDK from "../src";
import { BigNumber, ethers } from "ethers";
import selector from "./selector";
import {
  randomBigInt,
  randomAddress,
  randomToken,
  randomTenor,
  randomDeadline,
  randomBool,
} from "./random";

describe("size-sdk v1.7", () => {
  let window: any;
  let sdk: SDK<"v1.7">;

  const RUNS = 32;

  beforeAll(() => {
    const html = "<!DOCTYPE html><html><body></body></html>";
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    window = dom.window;
    window.ethereum = {};
  });

  test("fuzz deposit with random amounts, tokens and addresses", async () => {
    for (let i = 0; i < RUNS; i++) {
      const alice = randomAddress();
      const market1 = randomAddress();
      const amount = randomBigInt(1n, 1000000n);
      const token = randomToken();
      const to = randomAddress();

      sdk = new SDK({
        markets: [market1, randomAddress()],
        version: "v1.7",
      });

      const txs = sdk.tx.build(alice, [
        sdk.market.deposit(market1, {
          amount,
          to,
          token,
        }),
      ]);

      expect(txs.length).toBe(1);
      expect(txs[0].target).toBe(market1);
      expect(txs[0].data).toContain(
        selector("deposit((address,uint256,address))"),
      );
    }
  });

  test("fuzz sellCreditMarket with random parameters and addresses", async () => {
    for (let i = 0; i < RUNS; i++) {
      const alice = randomAddress();
      const market1 = randomAddress();
      const amount = randomBigInt(1n, 1000000n);
      const tenor = randomTenor();
      const deadline = randomDeadline();
      const lender = randomAddress();

      sdk = new SDK({
        markets: [market1],
        version: "v1.7",
      });

      const txs = sdk.tx.build(alice, [
        sdk.market.sellCreditMarket(market1, {
          lender,
          creditPositionId: ethers.constants.MaxUint256,
          amount,
          tenor,
          deadline,
          maxAPR: ethers.constants.MaxUint256,
          exactAmountIn: randomBool(),
        }),
      ]);

      expect(txs.length).toBe(1);
      expect(txs[0].target).toBe(market1);
      expect(txs[0].data).toContain(
        selector(
          "sellCreditMarket((address,uint256,uint256,uint256,uint256,uint256,bool))",
        ),
      );
    }
  });

  test("fuzz complex operations with random parameters and addresses", async () => {
    for (let i = 0; i < RUNS; i++) {
      const alice = randomAddress();
      const market1 = randomAddress();
      const market2 = randomAddress();
      const depositAmount = randomBigInt(1n, 1000000n);
      const borrowAmount = randomBigInt(1n, 1000000n);
      const tenor = randomTenor();
      const deadline = randomDeadline();
      const lender = randomAddress();
      const token = randomToken();

      sdk = new SDK({
        markets: [market1, market2],
        version: "v1.7",
      });

      const txs = sdk.tx.build(alice, [
        sdk.market.deposit(market1, {
          amount: depositAmount,
          to: alice,
          token,
        }),
        sdk.market.sellCreditMarket(market1, {
          lender,
          creditPositionId: ethers.constants.MaxUint256,
          amount: borrowAmount,
          tenor,
          deadline,
          maxAPR: ethers.constants.MaxUint256,
          exactAmountIn: randomBool(),
        }),
        sdk.market.withdraw(market1, {
          token,
          amount: ethers.constants.MaxUint256,
          to: alice,
        }),
      ]);

      expect(txs.length).toBe(3);
      txs.forEach((tx) => {
        expect(tx.data).not.toContain(
          selector("setAuthorization(address,uint256)"),
        );
        expect(tx.data).not.toContain(selector("callMarket(address,bytes)"));
        expect(tx.data).not.toContain(
          selector("depositOnBehalfOf(((address,uint256,address),address))"),
        );
        expect(tx.data).not.toContain(
          selector("withdrawOnBehalfOf(((address,uint256,address),address))"),
        );
      });
    }
  });

  test("fuzz setUserConfiguration with random parameters and addresses", async () => {
    for (let i = 0; i < RUNS; i++) {
      const alice = randomAddress();
      const market2 = randomAddress();
      const openingLimitBorrowCR = randomBigInt(0n, 1000000n);
      const allCreditPositionsForSaleDisabled = randomBool();
      const creditPositionIdsForSale = randomBool();
      const creditPositionIds: bigint[] = [];

      sdk = new SDK({
        markets: [market2],
        version: "v1.7",
      });

      const txs = sdk.tx.build(alice, [
        sdk.market.setUserConfiguration(market2, {
          openingLimitBorrowCR,
          allCreditPositionsForSaleDisabled,
          creditPositionIdsForSale,
          creditPositionIds,
        }),
      ]);

      expect(txs.length).toBe(1);
      expect(txs[0].target).toBe(market2);
      expect(txs[0].data).toContain(
        selector("setUserConfiguration((uint256,bool,bool,uint256[]))"),
      );
    }
  });
});
