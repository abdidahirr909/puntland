import { db } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") || "");

    if (!email || !password) {
      return NextResponse.redirect(
        new URL("/login?error=missing", req.url)
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=invalid", req.url)
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.redirect(
        new URL("/login?error=invalid", req.url)
      );
    }

    await createSession(user.id);

    if (user.role === "ADMIN" || user.role === "AGENT") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.redirect(
      new URL("/login?error=server", req.url)
    );
  }
}
