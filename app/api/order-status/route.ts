import { db } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { sendWhatsApp, sendSms } from "@/lib/notifications";
import { NextResponse } from "next/server";
const VALID_STATUSES = new Set(["PAYMENT_RECEIVED","PURCHASE_REQUESTED","PURCHASED","AT_DUBAI_WAREHOUSE","IN_TRANSIT","ARRIVED_BOSASO","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"]);
export async function POST(req: Request) {
  try { await requireRole(["ADMIN", "AGENT"]); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const f = await req.formData(); const orderId = String(f.get("orderId") || ""); const status = String(f.get("status") || "");
  if (!orderId || !VALID_STATUSES.has(status)) return NextResponse.json({ error: "Invalid order or status" }, { status: 400 });
  const o = await db.order.update({ where: { id: orderId }, data: { status: status as any, events: { create: { status: status as any, note: "Status updated by staff." } } }, include: { customer: true } });
  const msg = `Puntland Market: order ${o.orderNumber} is now ${status.replaceAll("_", " ")}.`;
  if (o.phone) { await sendWhatsApp(o.phone, msg); await sendSms(o.phone, msg); }
  return NextResponse.redirect(req.headers.get("referer") || new URL("/admin", req.url));
}
