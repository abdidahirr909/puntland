"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams =
    useSearchParams();

  const orderNumber =
    searchParams.get("order");

  return (
    <main className="container">
      <div
        className="panel"
        style={{
          maxWidth: 650,
          margin: "60px auto",
          textAlign: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: 15,
          }}
        >
          ✓
        </div>

        <h1>
          Order Received
        </h1>

        <p
          className="muted"
          style={{
            fontSize: 18,
          }}
        >
          Thank you for ordering from
          Puntland Market.
        </p>

        {orderNumber && (
          <div
            style={{
              background: "#f3f4f6",
              padding: 20,
              margin: "25px 0",
              borderRadius: 8,
            }}
          >
            <p
              className="muted"
              style={{
                margin: "0 0 5px",
              }}
            >
              Your order number
            </p>

            <strong
              style={{
                fontSize: 24,
              }}
            >
              {orderNumber}
            </strong>
          </div>
        )}

        <p>
          Please keep your order number.
          Our team will process your order
          and contact you using the phone
          number you provided.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: 10,
            marginTop: 30,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
          >
            Continue Shopping
          </Link>

          <Link
            href="/login"
            className="btn"
          >
            Owner Login
          </Link>
        </div>
      </div>
    </main>
  );
}
