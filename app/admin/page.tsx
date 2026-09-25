```tsx
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  try {
    const user = await requireRole(["ADMIN", "AGENT"]);

    return (
      <main className="container">
        <h1>Admin Dashboard</h1>

        <p>
          Velkommen, {user.name}
        </p>

        <p>
          Rolle: {user.role}
        </p>

        <p>
          <a href="/">Til nettbutikken</a>
        </p>
      </main>
    );
  } catch {
    redirect("/login");
  }
}
```
