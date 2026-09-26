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
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
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
      "All",
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
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
            alignItems: "center",
            gap: 20,
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>
              Puntland Market
            </h1>

            <p
              className="muted"
              style={{ margin: "4px 0 0" }}
            >
              Shop online and receive your order in Puntland.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Link
              href="/checkout"
              className="btn btn-primary"
            >
              Cart ({cartCount})
            </Link>

            <Link
              href="/login"
              className="btn"
            >
              Owner
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
            Quality products, delivered to Puntland
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
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            style={{
              flex: "1 1 260px",
              minWidth: 220,
            }}
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
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
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="panel">
            <h3>No products found</h3>
            <p className="muted">
              Try another search or category.
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
            {filteredProducts.map((product) => (
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
                    alignItems: "center",
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
                      "Quality product from Puntland Market."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
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
                      Add to Cart
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
            Checkout · ${cartTotal.toFixed(2)}
          </Link>
        </div>
      )}
    </main>
  );
}
