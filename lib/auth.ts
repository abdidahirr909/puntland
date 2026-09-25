import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./prisma";

const COOKIE = "pm_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set to a random value of at least 32 characters.");
  return value;
}
function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}
function encodeSession(userId: string) {
  const payload = `${userId}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${sign(payload)}`;
}
function decodeSession(value: string) {
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  if (signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  if (!userId || Number(expires) < Date.now()) return null;
  return userId;
}
export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function createSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, encodeSession(userId), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: MAX_AGE
  });
}
export async function currentUser() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const id = decodeSession(raw);
  if (!id) return null;
  return db.user.findUnique({ where: { id } });
}
export async function requireRole(roles: string[]) {
  const user = await currentUser();
  if (!user || !roles.includes(user.role)) throw new Error("UNAUTHORIZED");
  return user;
}
