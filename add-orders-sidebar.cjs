const fs = require("fs");
const path = "components/admin/Sidebar.tsx";
let content = fs.readFileSync(path, "utf8");

// Insert Orders line after Dashboard line
if (!content.includes('"/admin/orders"')) {
  content = content.replace(
    /(\{ href: "\/admin", label: "Dashboard", icon: "📊" \},)/,
    '$1\n  { href: "/admin/orders", label: "Orders", icon: "📋" },'
  );
  fs.writeFileSync(path, content);
  console.log("✅ Added Orders to sidebar");
} else {
  console.log("ℹ️  Orders already in sidebar");
}
