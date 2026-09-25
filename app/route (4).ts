import { db } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { calculateShipping } from "@/lib/shipping";
import { NextResponse } from "next/server";
export async function POST(req:Request){
 const u=await currentUser(); if(!u)return NextResponse.redirect(new URL("/login",req.url));
 const f=await req.formData(); const p=await db.product.findUnique({where:{id:String(f.get("productId"))}}); if(!p)return NextResponse.json({error:"Product not found"},{status:404});
 const shipping=calculateShipping(u.city||"Bosaso",p.weightKg); const productTotal=p.priceUsd; const serviceFee=2; const total=productTotal+shipping+serviceFee;
 const order=await db.order.create({data:{orderNumber:`PNT-${Date.now().toString().slice(-8)}`,customerId:u.id,city:u.city||"Bosaso",address:u.address||"",phone:u.phone||"",paymentMethod:String(f.get("paymentMethod")||"Sahal"),productTotalUsd:productTotal,shippingUsd:shipping,serviceFeeUsd:serviceFee,totalUsd:total,items:{create:{productId:p.id,quantity:1,unitPrice:p.priceUsd}},events:{create:{status:"PAYMENT_PENDING",note:"Order created; awaiting verified payment."}}}});
 return NextResponse.redirect(new URL(`/order/${order.orderNumber}`,req.url));
}
