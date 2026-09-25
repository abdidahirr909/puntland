import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
export default async function Product({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=await db.product.findUnique({where:{slug}});
 if(!p)return notFound();
 return <><header className="nav"><Link className="brand" href="/"><span className="mark">P</span><b>Puntland Market</b></Link><Link href="/">Shop</Link></header><main className="container"><div className="panel"><div className="pic">{p.image||"📦"}</div><h1>{p.name}</h1><span className="muted">{p.category}</span><h2 className="price">${p.priceUsd.toFixed(2)}</h2><p>{p.description||"International product available for delivery to Puntland."}</p><p className="muted">Weight: {p.weightKg} kg. Shipping and any applicable customs/fees are calculated at checkout.</p><Link className="btn btn-primary" href={`/checkout?product=${p.id}`}>Order this product</Link></div></main></>
}
