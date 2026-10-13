const fs = require("fs");
const path = "app/admin/page.tsx";
let content = fs.readFileSync(path, "utf8");

// 1. Extend Stats type
if (!content.includes("orders: number;")) {
  content = content.replace(
    /(messages: number;)/,
    '$1\n  orders: number;\n  newOrders: number;'
  );
}

// 2. Add Orders StatCard at the top
if (!content.includes('href="/admin/orders"')) {
  content = content.replace(
    /(<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">)/,
    '$1\n          <StatCard href="/admin/orders" icon="📋" label="Orders" value={stats.orders} badge={stats.newOrders} />'
  );
}

fs.writeFileSync(path, content);
console.log("✅ Updated dashboard");
