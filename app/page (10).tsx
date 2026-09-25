import { requireRole } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Admin(){
 const u=await requireRole(["ADMIN"]); const orders=await db.order.findMany({include:{customer:true},orderBy:{createdAt:"desc"},take:100});
 const products=await db.product.count({where:{active:true}}), customers=await db.user.count({where:{role:"CUSTOMER"}});
 return <div className="dash"><aside className="side"><h2>Puntland Market</h2><p>Admin</p><Link href="/">Store</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/agent">Dubai Agent</Link></aside><section className="main"><h1>Admin dashboard</h1><div className="stats"><div className="stat"><span className="muted">Orders</span><br/><b>{orders.length}</b></div><div className="stat"><span className="muted">Products</span><br/><b>{products}</b></div><div className="stat"><span className="muted">Customers</span><br/><b>{customers}</b></div><div className="stat"><span className="muted">Signed in</span><br/><b>{u.name}</b></div></div><div className="panel"><h2>Recent orders</h2><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>City</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.customer.name}</td><td>{o.city}</td><td>${o.totalUsd.toFixed(2)}</td><td><span className="badge">{o.status}</span></td></tr>)}</tbody></table></div></section></div>
}
