const fs = require("fs");
const { execSync } = require("child_process");

console.log("🔄 Resetting project...");

// Delete node_modules
if (fs.existsSync("node_modules")) {
  console.log("🗑 Removing node_modules...");
  fs.rmSync("node_modules", { recursive: true, force: true });
}

// Delete package-lock.json
if (fs.existsSync("package-lock.json")) {
  console.log("🗑 Removing package-lock.json...");
  fs.rmSync("package-lock.json");
}

// Reinstall dependencies
console.log("📦 Reinstalling dependencies...");
execSync("npm install", { stdio: "inherit" });

console.log("✅ Project reset complete!");
