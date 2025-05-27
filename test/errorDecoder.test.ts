import { describe, expect, test, beforeAll } from "@jest/globals";
import SDK from "../src";

describe("size-sdk error decoder", () => {
  test("should decode ERC20InsufficientBalance", async () => {
    const sdk = new SDK({
      markets: [],
      version: "v1.7",
    });

    const error = sdk.decode.errors(
      "0xe450d38c000000000000000000000000817c48bb59e866d5baefc9a90d04a0ce4e7d543b0000000000000000000000000000000000000000000000000000000000005b290000000000000000000000000000000000000000000000000000000002d8cb0c",
    );
    expect(error).toBe(
      "ERC20InsufficientBalance(0x817C48bB59e866d5baefC9A90d04a0CE4e7D543b,23337,47762188)",
    );
  });

  test("should decode CR_BELOW_OPENING_LIMIT_BORROW_CR", async () => {
    const sdk = new SDK({
      markets: [],
      version: "v1.7",
    });

    const error = sdk.decode.errors(
      "0x4e25c6da000000000000000000000000ff8f913373f23f937866ee5f25be74a211e308140000000000000000000000000000000000000000000000001bae8b92f96c355b0000000000000000000000000000000000000000000000001bc16d674ec80000",
    );
    expect(error).toBe(
      "CR_BELOW_OPENING_LIMIT_BORROW_CR(0xFF8F913373f23f937866EE5f25Be74A211E30814,1994685148337812827,2000000000000000000)",
    );
  });
});
