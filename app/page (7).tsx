"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  image: string | null;
  priceUsd: number;
  weightKg: number;
};

type CartItem = Product & {
  quantity: number;
};

const CART_KEY = "puntland-market-cart";

export default function HomePage() {
  const [products, setAlaab] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setQayb] = useState("Dhammaan");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAlaab(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    try {
      const saved = localStorage.getItem(CART_KEY);

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function decrease(productId: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function increase(productId: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  const categories = useMemo(() => {
    return [
      "Dhammaan",
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ];
  }, [products]);

  const filteredAlaab = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesQayb =
      category === "Dhammaan" ||
      product.category === category;

    return matchesSearch && matchesQayb;
  });

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartWadarta = cart.reduce(
    (total, item) =>
      total + item.priceUsd * item.quantity,
    0
  );

  return (
    <main>
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignAlaabooyin: "center",
            gap: 20,
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>
              POSH Online Shopping
            </h1>

            <p
              className="muted"
              style={{ margin: "4px 0 0" }}
            >
              Ka dukaamayso online oo dalabkaaga ku hel Puntland.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignAlaabooyin: "center",
            }}
          >
            <Link
              href="/checkout"
              className="btn btn-primary"
            >
              Gaadhiga ({cartCount})
            </Link>

            <Link
              href="/login"
              className="btn"
            >
              Maamulaha
            </Link>
          </div>
        </div>
      </header>

      <section
        className="container"
        style={{
          paddingTop: 35,
          paddingBottom: 20,
        }}
      >
        <div
          className="panel"
          style={{
            padding: 30,
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          <h2
            style={{
              fontSize: 32,
              marginBottom: 10,
            }}
          >
            Alaabo tayo leh oo laguugu keeno Puntland
          </h2>

          <p
            className="muted"
            style={{
              maxWidth: 650,
              margin: "0 auto",
            }}
          >
            Browse our products, add what you need to
            your cart, and complete your order without
            creating an account.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 25,
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onBeddel={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Raadi alaab..."
            style={{
              flex: "1 1 260px",
              minWidth: 220,
            }}
          />

          <select
            value={category}
            onBeddel={(event) =>
              setQayb(event.target.value)
            }
            style={{
              minWidth: 180,
            }}
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="panel">
            <p>Alaabta waa la soo shubayaa...</p>
          </div>
        ) : filteredAlaab.length === 0 ? (
          <div className="panel">
            <h3>Wax alaab ah lama helin</h3>
            <p className="muted">
              Isku day raadin ama qayb kale.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {filteredAlaab.map((product) => (
              <article
                key={product.id}
                className="panel"
                style={{
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 180,
                    display: "flex",
                    alignAlaabooyin: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                    fontSize: 64,
                  }}
                >
                  {product.image || "🛍️"}
                </div>

                <div style={{ padding: 18 }}>
                  <p
                    className="muted"
                    style={{
                      margin: "0 0 6px",
                      fontSize: 13,
                    }}
                  >
                    {product.category}
                  </p>

                  <h3
                    style={{
                      margin: "0 0 8px",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    className="muted"
                    style={{
                      minHeight: 42,
                    }}
                  >
                    {product.description ||
                      "Alaab tayo leh oo ka socota POSH Online Shopping."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignAlaabooyin: "center",
                      gap: 10,
                      marginTop: 15,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 20,
                      }}
                    >
                      ${product.priceUsd.toFixed(2)}
                    </strong>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      Ku dar Gaadhiga
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 30,
          }}
        >
          <Link
            href="/checkout"
            className="btn btn-primary"
            style={{
              padding: "14px 20px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.15)",
            }}
          >
            Dalbo · ${cartWadarta.toFixed(2)}
          </Link>
        </div>
      )}
    </main>
  );
}
