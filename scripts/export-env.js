// export-env.js
import fs from "fs";
import dotenv from "dotenv";
import os from "os";

const envFile = process.argv[2] || ".env";
if (!fs.existsSync(envFile)) {
  console.error(`[x] Env file not found: ${envFile}`);
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envFile));

// Windows CMD uses "set VAR=value", PowerShell uses "$env:VAR='value'"
const isWindows = os.platform() === "win32";
const usePowerShell = process.env.SHELL?.includes("powershell");

for (const [key, value] of Object.entries(envConfig)) {
  if (isWindows) {
    if (usePowerShell) {
      console.log(`$env:${key}="${value}"`);
    } else {
      console.log(`set ${key}=${value}`);
    }
  } else {
    console.log(`export ${key}="${value}"`);
  }
}
