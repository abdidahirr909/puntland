import { db } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { calculateShipping } from "@/lib/shipping";
import { redirect } from "next/navigation";
export default async function Checkout({searchParams}:{searchParams:Promise<{product?:string}>}){
 const user=await currentUser(); if(!user) redirect("/login");
 const {product}=await searchParams; const p=product?await db.product.findUnique({where:{id:product}}):null;
 if(!p)return <main className="container"><div className="panel"><h1>Checkout</h1><p>Select a product first.</p></div></main>;
 const shipping=calculateShipping(user.city||"Bosaso",p.weightKg), total=p.priceUsd+shipping;
 return <main className="container"><div className="panel" style={{maxWidth:650,margin:"auto"}}><h1>Checkout</h1><p><b>{p.name}</b> — ${p.priceUsd.toFixed(2)}</p><div className="panel"><p>Customer: {user.name}</p><p>Delivery: {user.city}, {user.address}</p><p>Shipping: ${shipping.toFixed(2)}</p><h2>Total: ${total.toFixed(2)}</h2></div><form className="form" action="/api/orders" method="post"><input type="hidden" name="productId" value={p.id}/><select name="paymentMethod"><option>Sahal</option><option>Other gateway</option></select><button className="btn btn-primary">Create order & continue to payment</button></form></div></main>
}
