const fs = require("fs");
const path = "app/menu/[id]/page.tsx";

let content = fs.readFileSync(path, "utf8");

// Remove any existing "use client" lines
content = content.replace(/^["']use client["'];?\s*\n/gm, "");
content = content.replace(/["']use client["'];?/g, "");

// Add "use client" at the very top with a blank line after
content = '"use client";\n\n' + content.trimStart();

fs.writeFileSync(path, content);

console.log("✅ Fixed: " + path);
console.log("\n--- First 5 lines ---");
console.log(content.split("\n").slice(0, 5).join("\n"));
