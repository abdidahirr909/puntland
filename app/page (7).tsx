import { db } from "@/lib/prisma";
import Link from "next/link";
export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams; const query = q?.trim() || "";
  const products = await db.product.findMany({ where: { active: true, ...(query ? { OR: [{ name: { contains: query } }, { category: { contains: query } }] } : {}) }, orderBy: { createdAt: "desc" }, take: 12 });
  return <><header className="nav"><Link className="brand" href="/"><span className="mark">P</span><span><b>Puntland Market</b><small>Shop globally. Delivered locally.</small></span></Link><nav className="navlinks"><Link href="/track">Track order</Link><Link className="btn btn-primary" href="/login">Account</Link></nav></header>
  <section className="hero"><span className="badge">🇸🇴 Puntland delivery</span><h1>Find it. Order it.<br/><span>We bring it to Puntland.</span></h1><p>Order products from international suppliers and receive them through our Puntland delivery network.</p>
  <form className="search" action="/" method="get"><input name="q" defaultValue={query} placeholder="Search products..." /><button className="btn btn-primary">Search</button></form></section>
  <main className="container"><div className="section-title"><div><span className="muted">SHOP</span><h2>{query ? `Results for "${query}"` : "Popular products"}</h2></div><Link className="btn btn-soft" href="/register">Create account</Link></div>
  <div className="grid">{products.map(p=><article className="card" key={p.id}><div className="pic">{p.image || "📦"}</div><div className="body"><span className="muted">{p.category}</span><h3>{p.name}</h3><div className="price">${p.priceUsd.toFixed(2)}</div><p className="muted">Shipping calculated at checkout</p><Link className="btn btn-primary" href={`/product/${p.slug}`}>View product</Link></div></article>)}</div>
  {products.length === 0 && <div className="panel"><p>No products found.</p></div>}</main><footer className="footer"><b>Puntland Market</b><p>Ordering and delivery platform for Puntland.</p></footer></>;
}
