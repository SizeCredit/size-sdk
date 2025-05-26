export default function deadline(seconds: number = 60): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + seconds);
}
