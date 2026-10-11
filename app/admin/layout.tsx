import { getCurrentAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}