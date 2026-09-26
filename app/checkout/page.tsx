"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  priceUsd: number;
  image: string | null;
  quantity: number;
};

const CART_KEY = "puntland-market-cart";

const shippingRates: Record<string, number> = {
  Bosaso: 3,
  Garowe: 5,
  Galkayo: 6,
  Qardho: 5,
  Badhan: 7,
  Dhahar: 7,
  Lasqorey: 8,
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bosaso");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Mobile Money");
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(CART_KEY);

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      setCart([]);
    }
  }, []);

  function increase(id: string) {
    setCart((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decrease(id: string) {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const productTotal = cart.reduce(
    (total, item) =>
      total + item.priceUsd * item.quantity,
    0
  );

  const shipping =
    shippingRates[city] ?? 6;

  const total = productTotal + shipping;

  async function submitOrder(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (!address.trim()) {
      setError(
        "Please enter your delivery address."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            city,
            address,
            paymentMethod,
            paymentRef,
            items: cart.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to place order."
        );
      }

      localStorage.removeItem(
        CART_KEY
      );

      window.location.href =
        `/checkout/success?order=${encodeURIComponent(
          data.orderNumber
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place order."
      );
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div
        style={{
          paddingTop: 30,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 15,
            marginBottom: 25,
          }}
        >
          <div>
            <Link href="/">
              ← Continue Shopping
            </Link>

            <h1
              style={{
                marginBottom: 5,
              }}
            >
              Checkout
            </h1>

            <p className="muted">
              No account is required.
            </p>
          </div>
        </div>

        {error && (
          <div
            className="panel"
            style={{
              border:
                "1px solid #ef4444",
              marginBottom: 20,
              padding: 15,
            }}
          >
            <strong>Error:</strong>{" "}
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="panel">
            <h2>Your cart is empty</h2>

            <p className="muted">
              Add some products before
              checking out.
            </p>

            <Link
              href="/"
              className="btn btn-primary"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
              gap: 25,
              alignItems: "start",
            }}
          >
            <div className="panel">
              <h2>Your Cart</h2>

              <div
                style={{
                  display: "grid",
                  gap: 15,
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: 15,
                      borderBottom:
                        "1px solid #e5e7eb",
                      paddingBottom: 15,
                    }}
                  >
                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <p
                        className="muted"
                        style={{
                          margin: "5px 0",
                        }}
                      >
                        $
                        {item.priceUsd.toFixed(
                          2
                        )}{" "}
                        each
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          decrease(item.id)
                        }
                      >
                        −
                      </button>

                      <strong>
                        {item.quantity}
                      </strong>

                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          increase(item.id)
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      $
                      {(
                        item.priceUsd *
                        item.quantity
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 25,
                  paddingTop: 20,
                  borderTop:
                    "2px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <span>
                    Products
                  </span>

                  <strong>
                    $
                    {productTotal.toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: 8,
                  }}
                >
                  <span>
                    Delivery
                  </span>

                  <strong>
                    $
                    {shipping.toFixed(2)}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: 15,
                    fontSize: 22,
                  }}
                >
                  <strong>
                    Total
                  </strong>

                  <strong>
                    ${total.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            <form
              className="panel form"
              onSubmit={submitOrder}
            >
              <h2>Delivery Details</h2>

              <label>
                Full name
                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="+252..."
                  required
                />
              </label>

              <label>
                City
                <select
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Bosaso
                  </option>
                  <option>
                    Garowe
                  </option>
                  <option>
                    Galkayo
                  </option>
                  <option>
                    Qardho
                  </option>
                  <option>
                    Badhan
                  </option>
                  <option>
                    Dhahar
                  </option>
                  <option>
                    Lasqorey
                  </option>
                </select>
              </label>

              <label>
                Delivery address
                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="Street, neighborhood, landmark..."
                  rows={4}
                  required
                />
              </label>

              <label>
                Payment method
                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Mobile Money
                  </option>
                  <option>
                    Cash on Delivery
                  </option>
                </select>
              </label>

              {paymentMethod ===
                "Mobile Money" && (
                <label>
                  Payment reference
                  <input
                    value={paymentRef}
                    onChange={(event) =>
                      setPaymentRef(
                        event.target.value
                      )
                    }
                    placeholder="Transaction/reference number"
                  />

                  <small className="muted">
                    You can provide the
                    payment reference if
                    you have already paid.
                  </small>
                </label>
              )}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 14,
                  fontSize: 17,
                }}
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order · $${total.toFixed(
                      2
                    )}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
