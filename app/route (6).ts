import { db } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(req:Request){
 const f=await req.formData(); const email=String(f.get("email")); const exists=await db.user.findUnique({where:{email}});
 if(exists)return NextResponse.redirect(new URL("/login?error=exists",req.url));
 const u=await db.user.create({data:{name:String(f.get("name")),email,phone:String(f.get("phone")),passwordHash:await hashPassword(String(f.get("password"))),city:String(f.get("city")),address:String(f.get("address"))}});
 await createSession(u.id); return NextResponse.redirect(new URL("/",req.url));
}
