import { describe, expect, test } from "@jest/globals";
import SDK from "../src";
import { ethers } from "ethers";
import {
  randomBigInt,
  randomAddress,
  randomToken,
  randomTenor,
  randomDeadline,
  randomBool,
  getRandomBigIntArray,
} from "./random";
import {
  MarketOperation,
  MarketFunctionName,
} from "../src/v1.8/actions/market";
import { Address } from "../src/types";
import { OnBehalfOfFunctionName } from "../src/v1.8/actions/onBehalfOf";

function generateRandomOperation(
  sdk: SDK<"v1.8">,
  market: Address,
): [MarketFunctionName, OnBehalfOfFunctionName, MarketOperation] {
  const operations: (() => [
    MarketFunctionName,
    OnBehalfOfFunctionName,
    MarketOperation,
  ])[] = [
    // deposit
    () => [
      "deposit",
      "depositOnBehalfOf",
      sdk.market.deposit(market, {
        amount: randomBigInt(1n, 1000000n),
        to: randomAddress(),
        token: randomToken(),
      }),
    ],
    // withdraw
    () => [
      "withdraw",
      "withdrawOnBehalfOf",
      sdk.market.withdraw(market, {
        token: randomToken(),
        amount: randomBigInt(1n, 1000000n),
        to: randomAddress(),
      }),
    ],
    // buyCreditLimit
    () => [
      "buyCreditLimit",
      "buyCreditLimitOnBehalfOf",
      sdk.market.buyCreditLimit(market, {
        maxDueDate: randomDeadline(),
        curveRelativeTime: {
          tenors: getRandomBigIntArray(3, 0n, 1000000n),
          aprs: getRandomBigIntArray(3, 0n, 1000000n),
          marketRateMultipliers: getRandomBigIntArray(3, 0n, 1000000n),
        },
      }),
    ],
    // buyCreditMarket
    () => [
      "buyCreditMarket",
      "buyCreditMarketOnBehalfOf",
      sdk.market.buyCreditMarket(market, {
        borrower: randomAddress(),
        creditPositionId: randomBigInt(0n, 1000000n),
        amount: randomBigInt(1n, 1000000n),
        tenor: randomTenor(),
        deadline: randomDeadline(),
        minAPR: randomBigInt(0n, 1000000n),
        exactAmountIn: randomBool(),
        collectionId: randomBigInt(0n, 1000000n),
        rateProvider: randomAddress(),
      }),
    ],
    // sellCreditLimit
    () => [
      "sellCreditLimit",
      "sellCreditLimitOnBehalfOf",
      sdk.market.sellCreditLimit(market, {
        maxDueDate: randomDeadline(),
        curveRelativeTime: {
          tenors: getRandomBigIntArray(3, 0n, 1000000n),
          aprs: getRandomBigIntArray(3, 0n, 1000000n),
          marketRateMultipliers: getRandomBigIntArray(3, 0n, 1000000n),
        },
      }),
    ],
    // sellCreditMarket
    () => [
      "sellCreditMarket",
      "sellCreditMarketOnBehalfOf",
      sdk.market.sellCreditMarket(market, {
        lender: randomAddress(),
        creditPositionId: randomBigInt(0n, 1000000n),
        amount: randomBigInt(1n, 1000000n),
        tenor: randomTenor(),
        deadline: randomDeadline(),
        maxAPR: randomBigInt(0n, 1000000n),
        exactAmountIn: randomBool(),
        collectionId: randomBigInt(0n, 1000000n),
        rateProvider: randomAddress(),
      }),
    ],
    // selfLiquidate
    () => [
      "selfLiquidate",
      "selfLiquidateOnBehalfOf",
      sdk.market.selfLiquidate(market, {
        creditPositionId: randomBigInt(0n, 1000000n),
      }),
    ],
    // setUserConfiguration
    () => [
      "setUserConfiguration",
      "setUserConfigurationOnBehalfOf",
      sdk.market.setUserConfiguration(market, {
        vault: randomAddress(),
        openingLimitBorrowCR: randomBigInt(0n, 1000000n),
        allCreditPositionsForSaleDisabled: randomBool(),
        creditPositionIdsForSale: randomBool(),
        creditPositionIds: [],
      }),
    ],
    // copyLimitOrders
    () => [
      "copyLimitOrders",
      "copyLimitOrdersOnBehalfOf",
      sdk.market.copyLimitOrders(market, {
        copyLoanOfferConfig: {
          minTenor: 0n,
          maxTenor: randomBigInt(0n, 1000000n),
          minAPR: 0n,
          maxAPR: randomBigInt(0n, 1000000n),
          offsetAPR: 0n,
        },
        copyBorrowOfferConfig: {
          minTenor: 0n,
          maxTenor: randomBigInt(0n, 1000000n),
          minAPR: 0n,
          maxAPR: randomBigInt(0n, 1000000n),
          offsetAPR: 0n,
        },
      }),
    ],
  ];

  // Pick a random operation
  const randomIndex = Math.floor(Math.random() * operations.length);
  return operations[randomIndex]();
}

function generateRandomOperations(
  sdk: SDK<"v1.8">,
  maxOperations: number,
  markets: Address[],
): [MarketFunctionName, OnBehalfOfFunctionName, MarketOperation][] {
  const numOperations = Math.floor(Math.random() * maxOperations) + 1;
  const operations: [
    MarketFunctionName,
    OnBehalfOfFunctionName,
    MarketOperation,
  ][] = [];

  for (let i = 0; i < numOperations; i++) {
    // Randomly select a market
    const marketIndex = Math.floor(Math.random() * markets.length);
    const market = markets[marketIndex];
    operations.push(generateRandomOperation(sdk, market));
  }

  return operations;
}

describe("size-sdk decoder fuzz tests", () => {
  const RUNS = 32;
  const MAX_OPERATIONS = 5;

  test("should decode arbitrary operations", async () => {
    for (let i = 0; i < RUNS; i++) {
      const alice = randomAddress();
      const market1 = randomAddress();
      const market2 = randomAddress();

      const sdk = new SDK({
        markets: [market1, market2],
        version: "v1.8",
        sizeFactory: randomAddress(),
      });

      // Generate random number of operations
      const operationsWithNames = generateRandomOperations(
        sdk,
        MAX_OPERATIONS,
        [market1, market2],
      );
      const operations = operationsWithNames.map(([_, __, op]) => op);

      const tx = sdk.tx.build(alice, operations);
      expect(tx.length).toBe(1);

      const decoded = sdk.decode.calldata(tx[0].data);

      // Verify that each operation's function name is present in the decoded message
      for (const [
        functionName,
        onBehalfOfFunctionName,
      ] of operationsWithNames) {
        if (operations.length > 1) {
          expect(decoded).toContain(onBehalfOfFunctionName);
          expect(decoded).toContain("multicall");
          expect(decoded).toContain("setAuthorization");
          expect(decoded).toContain("callMarket");
        } else {
          expect(decoded).toContain(functionName);
        }
      }
    }
  });
});
