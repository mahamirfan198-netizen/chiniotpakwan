import { getCurrentAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow login page without auth
  // Note: Next.js runs layout for all children, so we check path via headers isn't easy
  // Instead, we allow null user if they hit login page — handled by page itself
  return <>{children}</>;
}