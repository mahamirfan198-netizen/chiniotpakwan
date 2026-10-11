const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git" || entry.name === ".vercel") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walk(full));
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js") || entry.name.endsWith(".json") || entry.name.endsWith(".md"))) {
        files.push(full);
      }
    }
  } catch (e) {}
  return files;
}

const dirs = ["app", "lib", "data", "components", ".", "public"];
const seen = new Set();
const allFiles = [];

for (const dir of dirs) {
  if (fs.existsSync(dir)) {
    if (fs.statSync(dir).isDirectory()) {
      for (const f of walk(dir)) {
        if (!seen.has(f)) {
          seen.add(f);
          allFiles.push(f);
        }
      }
    }
  }
}

console.log("Scanning " + allFiles.length + " files...\n");
console.log("Files containing '9219945':\n");

let found = 0;
for (const file of allFiles) {
  try {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("9219945")) {
      console.log("  " + file);
      found++;
    }
  } catch (e) {}
}
console.log("\nTotal: " + found + " files");
