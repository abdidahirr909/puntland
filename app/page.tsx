export default function HomePage() {
  return (
    <main className="container">
      <div
        className="panel"
        style={{
          maxWidth: 800,
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        <h1>Puntland Market</h1>

        <p>
          Welcome to Puntland Market.
        </p>

        <p className="muted">
          Your online marketplace for Puntland.
        </p>

        <div style={{ marginTop: 30 }}>
          <a className="btn btn-primary" href="/login">
            Owner Login
          </a>
        </div>
      </div>
    </main>
  );
}
