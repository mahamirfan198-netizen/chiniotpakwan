import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-me-in-env-12345678"
);

const COOKIE_NAME = "admin_session";

export async function createAdminSession(adminId: string, email: string) {
  const token = await new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
const allowedEmails = (process.env.ADMIN_EMAILS || "mahamirfan198@gmail.com,support@chiniotpakwan.pk").split(",").map(e => e.trim());
const adminEmail = allowedEmails[0];
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.sub as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
