import { db } from "@/lib/prisma";
import { verifyFuraha sirta, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(req:Request){
 const f=await req.formData(); const u=await db.user.findUnique({where:{email:String(f.get("email"))}});
 if(!u || !(await verifyFuraha sirta(String(f.get("password")),u.passwordHash))) return NextResponse.redirect(new URL("/login?error=invalid",req.url));
 await createSession(u.id); const target=u.role==="ADMIN"?"/admin":u.role==="AGENT"?"/agent":"/";
 return NextResponse.redirect(new URL(target,req.url));
}
