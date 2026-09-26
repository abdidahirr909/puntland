import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Maamule(){
 const u=await requireRole(["ADMIN"]); const orders=await db.order.findMany({include:{customer:true},orderBy:{createdAt:"desc"},take:100});
 const products=await db.product.count({where:{active:true}}), customers=await db.user.count({where:{role:"CUSTOMER"}});
 return <div className="dash"><aside className="side"><h2>POSH Online Shopping</h2><p>Maamule</p><Link href="/">Dukaanka</Link><Link href="/admin/products">Alaab</Link><Link href="/admin/orders">Dalabyo</Link><Link href="/agent">Wakiilka Dubai</Link></aside><section className="main"><h1>Dashboard-ka Maamulaha</h1><div className="stats"><div className="stat"><span className="muted">Dalabyo</span><br/><b>{orders.length}</b></div><div className="stat"><span className="muted">Alaab</span><br/><b>{products}</b></div><div className="stat"><span className="muted">Macaamiil</span><br/><b>{customers}</b></div><div className="stat"><span className="muted">La galay</span><br/><b>{u.name}</b></div></div><div className="panel"><h2>Dalabyadii u dambeeyay</h2><table className="table"><thead><tr><th>Dalab</th><th>Macmiil</th><th>Magaalo</th><th>Wadarta</th><th>Xaalad</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.customer.name}</td><td>{o.city}</td><td>${o.totalUsd.toFixed(2)}</td><td><span className="badge">{o.status}</span></td></tr>)}</tbody></table></div></section></div>
}
