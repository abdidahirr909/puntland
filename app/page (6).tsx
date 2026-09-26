import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="container">
      <div
        className="panel"
        style={{
          maxWidth: 520,
          margin: "30px auto",
        }}
      >
        <h1>Gelitaanka Maamulaha</h1>

        <p className="muted">
          Gal si aad u maamusho POSH Online Shopping.
        </p>

        <form
          className="form"
          action="/api/auth/login"
          method="post"
        >
          <input
            name="email"
            type="email"
            placeholder="Iimayl"
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Furaha sirta"
            autoComplete="current-password"
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
          >
            Gal
          </button>
        </form>

        <p className="muted" style={{ marginTop: 20 }}>
          <Link href="/">
            ← ← Ku noqo Dukaanka
          </Link>
        </p>
      </div>
    </main>
  );
}
