import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
export default async function Product({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=await db.product.findUnique({where:{slug}});
 if(!p)return notFound();
 return <><header className="nav"><Link className="brand" href="/"><span className="mark">P</span><b>POSH Online Shopping</b></Link><Link href="/">Dukaanka</Link></header><main className="container"><div className="panel"><div className="pic">{p.image||"📦"}</div><h1>{p.name}</h1><span className="muted">{p.category}</span><h2 className="price">${p.priceUsd.toFixed(2)}</h2><p>{p.description||"Alaab caalami ah oo laguugu keeni karo Puntland."}</p><p className="muted">Miisaanka: {p.weightKg} kg. Kharashka gaarsiinta iyo wixii canshuur/khidmad ah waxaa lagu xisaabinayaa marka dalabka la dhamaystirayo.</p><Link className="btn btn-primary" href={`/checkout?product=${p.id}`}>Dalbo alaabtan</Link></div></main></>
}
