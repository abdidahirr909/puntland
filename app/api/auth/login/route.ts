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

    console.log("LOGIN DEBUG: email =", email);

    if (!email || !password) {
      console.log("LOGIN DEBUG: missing email or password");
      return NextResponse.redirect(
        new URL("/login?error=missing", req.url)
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
        new URL("/login?error=invalid", req.url)
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    console.log("LOGIN DEBUG: password valid =", valid);

    if (!valid) {
      return NextResponse.redirect(
        new URL("/login?error=invalid", req.url)
      );
    }

    await createSession(user.id);

    console.log("LOGIN DEBUG: session created");

   if (user.role === "ADMIN" || user.role === "AGENT") {
  return NextResponse.redirect(new URL("/admin?login=success", req.url));

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.redirect(
      new URL("/login?error=server", req.url)
    );
  }
}
