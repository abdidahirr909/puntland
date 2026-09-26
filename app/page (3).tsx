import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Agent(){
 await requireRole(["AGENT","ADMIN"]);
 const orders=await db.order.findMany({where:{status:{in:["PURCHASE_REQUESTED","PURCHASED","AT_DUBAI_WAREHOUSE"]}},include:{items:{include:{product:true}},customer:true},orderBy:{createdAt:"asc"}});
 return <div className="dash"><aside className="side"><h2>POSH Online Shopping</h2><p>Wakiilka Dubai</p><Link href="/">Dukaanka</Link><Link href="/agent">Dalabyada loo xilsaaray</Link><Link href="/admin">Maamule</Link></aside><section className="main"><h1>Gudiga Wakiilka Dubai</h1><p className="muted">Iibso alaabta laguu xilsaaray, geli/duub xogta raadraaca, oo dalabyada ku gudbi nidaamka Dubai.</p><div className="panel"><table className="table"><thead><tr><th>Dalab</th><th>Macmiil</th><th>Alaabooyin</th><th>Xaalad</th><th>Ficil</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.customer.name}</td><td>{o.items.map(i=>i.product.name).join(", ")}</td><td>{o.status}</td><td><form action="/api/orders/status" method="post"><input type="hidden" name="orderId" value={o.id}/><select name="status" defaultValue={o.status}><option>PURCHASED</option><option>AT_DUBAI_WAREHOUSE</option><option>IN_TRANSIT</option></select><button className="btn btn-soft">Cusboonaysii</button></form></td></tr>)}</tbody></table></div></section></div>
}
