import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Alaab(){
 await requireRole(["ADMIN"]); const products=await db.product.findMany({orderBy:{createdAt:"desc"}});
 return <div className="dash"><aside className="side"><h2>POSH Online Shopping</h2><Link href="/admin">Dashboard</Link><Link href="/admin/products">Alaab</Link></aside><section className="main"><h1>Kaydka Alaabta</h1><div className="panel"><table className="table"><thead><tr><th>Magac</th><th>Qayb</th><th>Qiime</th><th>Miisaan</th><th>Firfircoon</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>${p.priceUsd.toFixed(2)}</td><td>{p.weightKg} kg</td><td>{p.active?"Haa":"Maya"}</td></tr>)}</tbody></table></div></section></div>
}
