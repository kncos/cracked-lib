import { $ } from "bun";
import { rm } from "node:fs/promises";
import pkg from "./package.json" with { type: "json" };

const outdir = "./dist";

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

async function buildESM() {
  const result = await Bun.build({
    entrypoints: ["./index.ts"],
    outdir,
    target: "node",
    format: "esm",
    external,
    sourcemap: "external",
  });

  if (!result.success) {
    result.logs.forEach((l) => console.error(l));
    throw new Error("ESM build failed");
  }
}

async function buildCJS() {
  const result = await Bun.build({
    entrypoints: ["./index.ts"],
    outdir,
    target: "node",
    format: "cjs",
    naming: "[dir]/[name].cjs",
    external,
    sourcemap: "external",
  });

  if (!result.success) {
    result.logs.forEach((l) => console.error(l));
    throw new Error("CJS build failed");
  }
}

async function buildTypes() {
  await $`tsc --project tsconfig.build.json`;
}

// ---- run ----

console.log("🗑️  Cleaning dist...");
await rm(outdir, { recursive: true, force: true });

console.log("🔨 Building ESM...");
await buildESM();

console.log("🔨 Building CJS...");
await buildCJS();

console.log("🔷 Generating types...");
await buildTypes();

console.log("\n✅ Build complete!");
