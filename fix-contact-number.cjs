const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      files.push(...walk(full));
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
const dirs = ["app", "lib", "data", "components"];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;

    // Replace old numbers with new
    content = content.replace(/03009219945/g, "03008008672");
    content = content.replace(/0300 9219945/g, "0300 8008672");
    content = content.replace(/923009219945/g, "923008008672");

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log("Updated:", file);
      changed++;
    }
  }
}

console.log("\n✅ Updated " + changed + " files with new contact number");
