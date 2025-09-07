"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, username: form.username, password: form.password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
      } else {
        const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ emailOrUsername: form.emailOrUsername, password: form.password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="flex justify-center gap-4">
        <button className={`px-3 py-1.5 rounded ${mode === "login" ? "bg-foreground text-background" : "border"}`} onClick={() => setMode("login")}>Login</button>
        <button className={`px-3 py-1.5 rounded ${mode === "signup" ? "bg-foreground text-background" : "border"}`} onClick={() => setMode("signup")}>Sign up</button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" ? (
          <>
            <input required type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required type="text" placeholder="Username" className="w-full border px-3 py-2 rounded" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input required type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </>
        ) : (
          <>
            <input required type="text" placeholder="Email or Username" className="w-full border px-3 py-2 rounded" value={form.emailOrUsername} onChange={(e) => setForm({ ...form, emailOrUsername: e.target.value })} />
            <input required type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-foreground text-background py-2">{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}</button>
      </form>
    </div>
  );
}


