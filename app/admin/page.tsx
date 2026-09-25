```tsx
import { db } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  let user;

  try {
    user = await requireRole(["ADMIN", "AGENT"]);
  } catch {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Velkommen, {user.name}
          </p>
        </div>

        <a href="/" className="btn">
          Til nettbutikken
        </a>
      </div>

      <section className="panel" style={{ marginBottom: 30 }}>
        <h2>Ordrer</h2>

        {orders.length === 0 ? (
          <p className="muted">Ingen ordrer ennå.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Ordre
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Kunde
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    By
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Telefon
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Totalt
                  </th>
                  <th style={{ textAlign: "left", padding: 10 }}>
                    Dato
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ padding: 10 }}>
                      <strong>{order.orderNumber}</strong>
                    </td>

                    <td style={{ padding: 10 }}>
                      {order.customer.name}
                    </td>

                    <td style={{ padding: 10 }}>
                      {order.city}
                    </td>

                    <td style={{ padding: 10 }}>
                      {order.phone}
                    </td>

                    <td style={{ padding: 10 }}>
                      {order.status.replaceAll("_", " ")}
                    </td>

                    <td style={{ padding: 10 }}>
                      ${order.totalUsd.toFixed(2)}
                    </td>

                    <td style={{ padding: 10 }}>
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Produkter</h2>

        {products.length === 0 ? (
          <p className="muted">Ingen produkter.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="panel"
                style={{ margin: 0 }}
              >
                <div style={{ fontSize: 40 }}>
                  {product.image || "📦"}
                </div>

                <h3>{product.name}</h3>

                <p className="muted">
                  {product.category}
                </p>

                <p>
                  <strong>
                    ${product.priceUsd.toFixed(2)}
                  </strong>
                </p>

                <p className="muted">
                  Vekt: {product.weightKg} kg
                </p>

                <p>
                  {product.active ? "Aktiv" : "Deaktivert"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
```
