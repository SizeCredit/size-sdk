export type Address = `0x${string & { length: 40 }}`;

export type Bytes32 = `0x${string & { length: 64 }}`;

export type Bytes = `0x${string}`;
