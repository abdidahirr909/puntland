import { db } from "@/lib/prisma";
import Link from "next/link";
const statuses=["PAYMENT_PENDING","PAYMENT_RECEIVED","PURCHASE_REQUESTED","PURCHASED","AT_DUBAI_WAREHOUSE","IN_TRANSIT","ARRIVED_BOSASO","OUT_FOR_DELIVERY","DELIVERED"];
export default async function DalabPage({params}:{params:Promise<{number:string}>}){
 const {number}=await params; const o=await db.order.findUnique({where:{orderNumber:number},include:{items:{include:{product:true}},events:true,customer:true}});
 if(!o)return <main className="container"><div className="panel"><h1>Dalab not found</h1></div></main>;
 const idx=statuses.indexOf(o.status);
 return <main className="container"><div className="panel" style={{maxWidth:800,margin:"auto"}}><span className="badge">{o.status}</span><h1>Dalab {o.orderNumber}</h1><p>{o.customer.name} · {o.city}</p><div className="status-grid">{statuses.map((s,i)=><div className={"status "+(i<=idx?"active":"")} key={s}>{i<=idx?"✓":"○"} {s.replaceAll("_"," ")}</div>)}</div><div className="panel" style={{marginTop:20}}><h3>Cost</h3><p>Alaab: ${o.productWadartaUsd.toFixed(2)}</p><p>Shipping: ${o.shippingUsd.toFixed(2)}</p><p>Service fee: ${o.serviceFeeUsd.toFixed(2)}</p><h2>Wadarta: ${o.totalUsd.toFixed(2)}</h2></div><p className="muted">For the live version, verified payment webhooks and WhatsApp/SMS notifications should be connected before marking payment received.</p><Link href="/">Continue shopping</Link></div></main>
}
