```tsx
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
        <h1>Owner Login</h1>

        <p className="muted">
          Log in for å administrere Puntland Market.
        </p>

        <form
          className="form"
          action="/api/auth/login"
          method="post"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <button className="btn btn-primary" type="submit">
            Log in
          </button>
        </form>

        <p className="muted" style={{ marginTop: 20 }}>
          <Link href="/">
            ← Tilbake til butikken
          </Link>
        </p>
      </div>
    </main>
  );
}
```
