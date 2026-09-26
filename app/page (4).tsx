"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();

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

        <h1>Dalabka Waa La Helay</h1>

        <p
          className="muted"
          style={{
            fontSize: 18,
          }}
        >
          Waad ku mahadsan tahay dalbashada POSH Online Shopping.
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
              Lambarka dalabkaaga
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
          Fadlan kaydi lambarka dalabkaaga. Kooxdayadu way ka shaqayn doontaa dalabkaaga, waxaana kula soo xiriiri doonaa lambarka telefoonka aad bixisay.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 30,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
          >
            Sii wad dukaamaysiga
          </Link>

          <Link
            href="/login"
            className="btn"
          >
            Gelitaanka Maamulaha
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Dhamaystirka DalabkaSuccessPage() {
  return (
    <Suspense
      fallback={
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
            <h1>Waa la soo shubayaa...</h1>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
