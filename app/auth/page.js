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
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, username: form.username, password: form.password }),
          origin: process.env.FRONTEND_URL,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOrUsername: form.emailOrUsername, password: form.password }),
          origin: process.env.FRONTEND_URL,
        });
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
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 space-y-6 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/10 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-center">
          {mode === "signup" ? "Create Account" : "Sign In"}
        </h1>
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              mode === "login"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              mode === "signup"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" ? (
            <>
              <div>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full border border-black/20 dark:border-white/20 px-3 py-2 rounded-lg bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Username"
                  className="w-full border border-black/20 dark:border-white/20 px-3 py-2 rounded-lg bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div>
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="w-full border border-black/20 dark:border-white/20 px-3 py-2 rounded-lg bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Email or Username"
                  className="w-full border border-black/20 dark:border-white/20 px-3 py-2 rounded-lg bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={form.emailOrUsername}
                  onChange={(e) => setForm({ ...form, emailOrUsername: e.target.value })}
                />
              </div>
              <div>
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="w-full border border-black/20 dark:border-white/20 px-3 py-2 rounded-lg bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </>
          )}
          {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white dark:bg-white dark:text-black py-2.5 font-medium transition-opacity duration-200 disabled:opacity-50 hover:bg-black/80 dark:hover:bg-white/80"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}