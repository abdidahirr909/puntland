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

export default function Dhamaystirka DalabkaPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setMagac] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setMagaalada] = useState("Bosaso");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Lacagta Moobilka");
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

  const productWadarta = cart.reduce(
    (total, item) =>
      total + item.priceUsd * item.quantity,
    0
  );

  const shipping =
    shippingRates[city] ?? 6;

  const total = productWadarta + shipping;

  async function submitDalab(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Gaadhigaagu waa madhan yahay."
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Fadlan geli magacaaga."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Fadlan geli lambarka telefoonkaaga."
      );
      return;
    }

    if (!address.trim()) {
      setError(
        "Fadlan geli cinwaanka gaarsiinta."
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
            "Dalabka lama diri karin."
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
          : "Dalabka lama diri karin."
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
            alignAlaabooyin: "center",
            gap: 15,
            marginBottom: 25,
          }}
        >
          <div>
            <Link href="/">
              ← Sii wad dukaamaysiga
            </Link>

            <h1
              style={{
                marginBottom: 5,
              }}
            >
              Dhamaystirka Dalabka
            </h1>

            <p className="muted">
              Akown looma baahna.
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
            <strong>Khalad:</strong>{" "}
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="panel">
            <h2>Gaadhigaagu waa madhan yahay</h2>

            <p className="muted">
              Ku dar alaabo gaadhiga ka hor intaadan dalabka dhamaystirin.
            </p>

            <Link
              href="/"
              className="btn btn-primary"
            >
              Daawo Alaabta
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
              gap: 25,
              alignAlaabooyin: "start",
            }}
          >
            <div className="panel">
              <h2>Gaadhigaaga</h2>

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
                      alignAlaabooyin: "center",
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
                        midkiiba
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignAlaabooyin:
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
                    Alaab
                  </span>

                  <strong>
                    $
                    {productWadarta.toFixed(
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
                    Gaarsiinta
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
                    Wadarta
                  </strong>

                  <strong>
                    ${total.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            <form
              className="panel form"
              onSubmit={submitDalab}
            >
              <h2>Gaarsiinta Details</h2>

              <label>
                Magaca oo buuxa
                <input
                  value={name}
                  onBeddel={(event) =>
                    setMagac(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  required
                />
              </label>

              <label>
                Lambarka telefoonka
                <input
                  value={phone}
                  onBeddel={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="+252..."
                  required
                />
              </label>

              <label>
                Magaalada
                <select
                  value={city}
                  onBeddel={(event) =>
                    setMagaalada(
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
                Gaarsiinta address
                <textarea
                  value={address}
                  onBeddel={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="Waddada, xaafadda, calaamad..."
                  rows={4}
                  required
                />
              </label>

              <label>
                Habka lacag bixinta
                <select
                  value={paymentMethod}
                  onBeddel={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Lacagta Moobilka
                  </option>
                  <option>
                    Cash on Gaarsiinta
                  </option>
                </select>
              </label>

              {paymentMethod ===
                "Lacagta Moobilka" && (
                <label>
                  Tixraaca lacag bixinta
                  <input
                    value={paymentRef}
                    onBeddel={(event) =>
                      setPaymentRef(
                        event.target.value
                      )
                    }
                    placeholder="Lambarka macaamilka/tixraaca"
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
                  ? "Dalabka waa la dirayaa..."
                  : `Dir Dalabka · $${total.toFixed(
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
