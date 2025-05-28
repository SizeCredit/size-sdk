import { ethers } from "ethers";

export function randomBigInt(min: bigint, max: bigint): bigint {
  const range = max - min;
  const randomHex = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  const randomBigInt = BigInt(randomHex);
  return min + (randomBigInt % range);
}

export function getRandomBigIntArray(
  length: number,
  min: bigint,
  max: bigint,
): bigint[] {
  return Array.from({ length }, () => randomBigInt(min, max));
}

export function randomAddress(): `0x${string}` {
  return ethers.utils.getAddress(
    ethers.utils.hexlify(ethers.utils.randomBytes(20)),
  ) as `0x${string}`;
}

export function randomToken(): `0x${string}` {
  return ethers.utils.getAddress(
    ethers.utils.hexlify(ethers.utils.randomBytes(20)),
  ) as `0x${string}`;
}

export function randomTenor(
  min = 24n * 60n * 60n,
  max = 365n * 24n * 60n * 60n,
): bigint {
  return randomBigInt(min, max);
}

export function randomDeadline(
  min = 1893456000n,
  max = 1893456000n + 365n * 24n * 60n * 60n,
): bigint {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return now + randomBigInt(min, max);
}

export function randomBool(): boolean {
  // Use the first bit of a random byte to generate a boolean
  return (ethers.utils.randomBytes(1)[0] & 1) === 1;
}
