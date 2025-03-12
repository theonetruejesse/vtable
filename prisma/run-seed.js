#!/usr/bin/env node

// This script helps run the seed command with the correct environment

import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

try {
  console.log("🌱 Running seed script...");

  // Get the directory of the current module
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Resolve the project root path (one level up from prisma directory)
  const projectRoot = resolve(__dirname, "..");

  // Read the .env file in the prisma directory
  const envPath = resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
    if (dbUrlMatch && dbUrlMatch[1]) {
      process.env.DATABASE_URL = dbUrlMatch[1];
      console.log(
        `✅ Using DATABASE_URL from .env: ${dbUrlMatch[1].substring(0, 30)}...`,
      );
    }
  } else {
    console.log("⚠️ No .env file found in prisma directory");
  }

  // Run the seed command
  execSync("npx ts-node --esm prisma/seed.ts", {
    stdio: "inherit",
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_PATH: projectRoot,
    },
  });

  console.log("✅ Seed completed!");
} catch (error) {
  console.error("❌ Error running seed:", error);
  process.exit(1);
}
