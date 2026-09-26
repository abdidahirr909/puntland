import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Agent(){
 await requireRole(["AGENT","ADMIN"]);
 const orders=await db.order.findMany({where:{status:{in:["PURCHASE_REQUESTED","PURCHASED","AT_DUBAI_WAREHOUSE"]}},include:{items:{include:{product:true}},customer:true},orderBy:{createdAt:"asc"}});
 return <div className="dash"><aside className="side"><h2>Puntland Market</h2><p>Dubai Agent</p><Link href="/">Store</Link><Link href="/agent">Assigned orders</Link><Link href="/admin">Admin</Link></aside><section className="main"><h1>Dubai Agent Panel</h1><p className="muted">Purchase assigned products, upload/record tracking, and move orders through the Dubai workflow.</p><div className="panel"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Action</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.customer.name}</td><td>{o.items.map(i=>i.product.name).join(", ")}</td><td>{o.status}</td><td><form action="/api/orders/status" method="post"><input type="hidden" name="orderId" value={o.id}/><select name="status" defaultValue={o.status}><option>PURCHASED</option><option>AT_DUBAI_WAREHOUSE</option><option>IN_TRANSIT</option></select><button className="btn btn-soft">Update</button></form></td></tr>)}</tbody></table></div></section></div>
}
