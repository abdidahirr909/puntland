import { db } from "@/lib/prisma";
import Link from "next/link";
const statuses = ["PAYMENT_PENDING","PAYMENT_RECEIVED","PURCHASE_REQUESTED","PURCHASED","AT_DUBAI_WAREHOUSE","IN_TRANSIT","ARRIVED_BOSASO","OUT_FOR_DELIVERY","DELIVERED"];
export default async function Track({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const number = id?.trim().toUpperCase();
  const order = number ? await db.order.findUnique({ where: { orderNumber: number }, include: { events: { orderBy: { createdAt: "desc" } } } }) : null;
  const idx = order ? statuses.indexOf(order.status) : -1;
  return <main className="container"><div className="panel" style={{ maxWidth: 700, margin: "30px auto" }}>
    <h1>Track your order</h1><form className="form" action="/track" method="get"><input name="id" placeholder="PNT-..." defaultValue={number || ""} required/><button className="btn btn-primary">Track</button></form>
    {!number && <p className="muted">Enter the order number from your confirmation.</p>}
    {number && !order && <p style={{ color: "#a33" }}>Order not found. Check the order number and try again.</p>}
    {order && <div style={{ marginTop: 20 }}><span className="badge">{order.status.replaceAll("_", " ")}</span><h2>{order.orderNumber}</h2><div className="status-grid">
      {statuses.map((s, i) => <div className={"status " + (i <= idx ? "active" : "")} key={s}>{i <= idx ? "✓" : "○"} {s.replaceAll("_", " ")}</div>)}
    </div><p className="muted" style={{ marginTop: 16 }}>Last update: {order.events[0] ? new Date(order.events[0].createdAt).toLocaleString() : "Pending"}</p></div>}
    <p><Link href="/">← Continue shopping</Link></p>
  </div></main>;
}
