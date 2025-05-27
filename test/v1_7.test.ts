import { JSDOM } from "jsdom";
import { describe, expect, test, beforeAll } from "@jest/globals";
import SDK from "../src";
import { BigNumber, ethers } from "ethers";
import selector from "./selector";
import Authorization, { Action } from "../src/Authorization";
import SizeABI from "../src/v1.8/abi/Size.json";
import sizeFactoryABI from "../src/v1.8/abi/SizeFactory.json";

describe("size-sdk v1.7", () => {
  let window: any;
  let sdk: SDK<"v1.7">;

  const sizeFactory = "0x000000000000000000000000000000000000ffff";

  const alice = "0x0000000000000000000000000000000000010000";
  const bob = "0x0000000000000000000000000000000000020000";
  const charlie = "0x0000000000000000000000000000000000030000";

  const market1 = "0x0000000000000000000000000000000000000123";
  const market2 = "0x0000000000000000000000000000000000000456";

  const weth = "0x4200000000000000000000000000000000000006";
  const collateral2 = "0x0000000000000000000000000000000000007777";
  const usdc = "0x0000000000000000000000000000000000008888";

  const ISize = new ethers.utils.Interface(SizeABI.abi);
  const ISizeFactory = new ethers.utils.Interface(sizeFactoryABI.abi);

  beforeAll(() => {
    const html = "<!DOCTYPE html><html><body></body></html>";
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    window = dom.window;
    window.ethereum = {};

    sdk = new SDK({
      sizeFactory,
      markets: [market1, market2],
      version: "v1.7",
    });
    window.sdk = sdk;
  });

  test("should expose size factory on window", () => {
    expect(window.sdk).toBeInstanceOf(Object);
  });

  test("size.tx.build should return converted output", async () => {
    const txs = sdk.tx.build(alice, [
      sdk.market.deposit(market1, {
        amount: "100",
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(txs.length).toBe(1);
    expect(txs[0].target).toBe(market1);
    expect(txs[0].data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigInt", async () => {
    const txs = sdk.tx.build(alice, [
      sdk.market.deposit(market1, {
        amount: BigInt(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(txs.length).toBe(1);
    expect(txs[0].target).toBe(market1);
    expect(txs[0].data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept bigint", async () => {
    const txs = sdk.tx.build(alice, [
      sdk.market.deposit(market1, {
        amount: 100n,
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(txs.length).toBe(1);
    expect(txs[0].target).toBe(market1);
    expect(txs[0].data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("size.tx.build should accept BigNumber", async () => {
    const txs = sdk.tx.build(alice, [
      sdk.market.deposit(market1, {
        amount: BigNumber.from(100),
        to: "0x0000000000000000000000000000000000001337",
        token: "0x4200000000000000000000000000000000000006",
      }),
    ]);
    expect(txs.length).toBe(1);
    expect(txs[0].target).toBe(market1);
    expect(txs[0].data).not.toContain(alice);
    expect(txs[0].data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
  });

  test("ideal flow but under v1.7", async () => {
    const txs = sdk.tx.build(alice, [
      sdk.market.setUserConfiguration(market2, {
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
        copyAddress: charlie,
        copyLoanOffer: sdk.constants.FullCopy,
        copyBorrowOffer: sdk.constants.FullCopy,
      }),
    ]);
    expect(txs.length).toBe(3);
    txs.forEach((tx) => {
      expect(tx.data).not.toContain(
        selector("setAuthorization(address,uint256)"),
      );
      expect(tx.data).not.toContain(
        selector("depositOnBehalfOf(((address,uint256,address),address))"),
      );
    });
    expect(txs[1].data).toContain(
      selector("deposit((address,uint256,address))"),
    );

    expect(txs[0].target).toBe(market2);
    expect(txs[0].data).toBe(
      "0x2e106f21000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000",
    );
    expect(txs[1].target).toBe(market1);
    expect(txs[1].data).toBe(
      "0x0cf8542f000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000001337",
    );
    expect(txs[2].target).toBe(market1);
    expect(txs[2].data).toBe(
      "0xf052e7a400000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
    );
  });

  test("v1.7 borrow from multiple markets", async () => {
    const wethAmount = 300n;
    const collateral2Amount = 400n;
    const usdcAmount = 100n;
    const tenor = 365n * 24n * 60n * 60n;
    const deadline = 1893456000n;

    const txs = sdk.tx.build(alice, [
      sdk.market.deposit(market1, {
        amount: wethAmount,
        to: alice,
        token: weth,
      }),
      sdk.market.sellCreditMarket(market1, {
        lender: bob,
        creditPositionId: ethers.constants.MaxUint256,
        amount: usdcAmount,
        tenor: tenor,
        deadline: deadline,
        maxAPR: ethers.constants.MaxUint256,
        exactAmountIn: false,
      }),
      sdk.market.deposit(market2, {
        amount: collateral2Amount,
        to: alice,
        token: collateral2,
      }),
      sdk.market.sellCreditMarket(market2, {
        lender: charlie,
        creditPositionId: ethers.constants.MaxUint256,
        amount: usdcAmount,
        tenor: tenor,
        deadline: deadline,
        maxAPR: ethers.constants.MaxUint256,
        exactAmountIn: false,
      }),
      sdk.market.withdraw(market1, {
        token: usdc,
        amount: ethers.constants.MaxUint256,
        to: alice,
      }),
    ]);

    expect(txs.length).toBe(5);
    txs.forEach((tx) => {
      expect(tx.data).not.toContain(selector(ISizeFactory, "setAuthorization"));
      expect(tx.data).not.toContain(selector(ISizeFactory, "callMarket"));
      expect(tx.data).not.toContain(selector(ISize, "depositOnBehalfOf"));
      expect(tx.data).not.toContain(
        selector(ISize, "sellCreditMarketOnBehalfOf"),
      );
      expect(tx.data).not.toContain(selector(ISize, "withdrawOnBehalfOf"));
    });
  });
});
