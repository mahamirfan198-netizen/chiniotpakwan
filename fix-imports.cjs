const fs = require("fs");
const path = require("path");

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      results.push(full);
    }
  }
  return results;
}

const dirs = ["app", "lib", "components"];
let fixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = walk(dir);
  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;
    content = content.replace(/adminAUTH/g, "adminAuth");
    content = content.replace(/adminsession/g, "adminAuth");
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log("Fixed: " + file);
      fixed++;
    }
  }
}

console.log("\nFixed " + fixed + " files.");
