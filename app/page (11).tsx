import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Products(){
 await requireRole(["ADMIN"]); const products=await db.product.findMany({orderBy:{createdAt:"desc"}});
 return <div className="dash"><aside className="side"><h2>Puntland Market</h2><Link href="/admin">Dashboard</Link><Link href="/admin/products">Products</Link></aside><section className="main"><h1>Product database</h1><div className="panel"><table className="table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Weight</th><th>Active</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>${p.priceUsd.toFixed(2)}</td><td>{p.weightKg} kg</td><td>{p.active?"Yes":"No"}</td></tr>)}</tbody></table></div></section></div>
}
