import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      esModule: false,
    },
    {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      mainFields: ["module", "main"],
      extensions: [".ts", ".js", ".json"],
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
      requireReturnsDefault: "auto",
    }),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        outDir: undefined,
        declaration: false,
        declarationMap: false,
      },
      sourceMap: true,
      module: "ESNext",
    }),
  ],
  external: [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ],
};
