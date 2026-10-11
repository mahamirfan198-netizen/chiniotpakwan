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
    } else if (fs.statSync(dir).isFile()) {
      allFiles.push(dir);
    }
  }
}

let changed = 0;
for (const file of allFiles) {
  try {
    let content = fs.readFileSync(file, "utf8");
    const original = content;

    // Replace ALL variations of old number
    content = content.replace(/0300\s*9219945/g, "0300 8008672");
    content = content.replace(/03009219945/g, "03008008672");
    content = content.replace(/923009219945/g, "923008008672");
    content = content.replace(/9219945/g, "8008672");

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log("✅ Fixed: " + file);
      changed++;
    }
  } catch (e) {}
}
console.log("\n✅ Updated " + changed + " files");
