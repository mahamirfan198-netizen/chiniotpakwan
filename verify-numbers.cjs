const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...walk(full));
      else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js") || entry.name.endsWith(".json") || entry.name.endsWith(".md"))) files.push(full);
    }
  } catch (e) {}
  return files;
}

const allFiles = [...walk("app"), ...walk("lib"), ...walk("data"), ...walk("components")];

let oldCount = 0;
let newCount = 0;

for (const file of allFiles) {
  try {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("9219945")) oldCount++;
    if (content.includes("8008672")) newCount++;
  } catch (e) {}
}

console.log("Old number (9219945) still in: " + oldCount + " files");
console.log("New number (8008672) in: " + newCount + " files");
if (oldCount === 0) console.log("\n✅ All files updated!");
else console.log("\n⚠️ Some files still have old number");
