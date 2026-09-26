import { db } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const SITE_URL = "https://puntland-market-1cp2.onrender.com";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") || "");

    if (!email || !password) {
      return NextResponse.redirect(
        `${SITE_URL}/login?error=missing`
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    console.log(
      "LOGIN DEBUG: user found =",
      !!user,
      "role =",
      user?.role
    );

    if (!user) {
      return NextResponse.redirect(
        `${SITE_URL}/login?error=invalid`
      );
    }

    const valid = await verifyPassword(
      password,
      user.passwordHash
    );

    console.log(
      "LOGIN DEBUG: password valid =",
      valid
    );

    if (!valid) {
      return NextResponse.redirect(
        `${SITE_URL}/login?error=invalid`
      );
    }

    await createSession(user.id);

    console.log(
      "LOGIN DEBUG: session created"
    );

    if (
      user.role === "ADMIN" ||
      user.role === "AGENT"
    ) {
      return NextResponse.redirect(
        `${SITE_URL}/admin?login=success`
      );
    }

    return NextResponse.redirect(
      `${SITE_URL}/`
    );
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return NextResponse.redirect(
      `${SITE_URL}/login?error=server`
    );
  }
}
