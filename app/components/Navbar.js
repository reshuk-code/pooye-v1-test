"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch profile
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store", origin: process.env.FRONTEND_URL });
        if (!res.ok) throw new Error("Failed to fetch profile");
        setProfile(await res.json());
      } catch {
        setError("");
      }
    })();

    // Initialize theme based on system preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.classList.toggle("dark", systemTheme === "dark");

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newSystemTheme === "dark");
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return (
    <nav className="w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">pooye</Link>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle navigation menu"
            role="button"
            className="sm:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
            <div className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
            <div className="w-6 h-0.5 bg-black dark:bg-white" />
          </button>
          <div className="hidden sm:flex gap-4 items-center">
            {!profile && (
              <>
                <Link href="/" className="hover:underline text-black dark:text-white">Home</Link>
                <Link href="#features" className="hover:underline text-black dark:text-white">Features</Link>
                <Link href="#testimonials" className="hover:underline text-black dark:text-white">Reviews</Link>
              </>
            )}
            {profile ? (
              <>
                <Link href="/confess" className="rounded px-3 py-1.5 border border-black/10 dark:border-white/10 text-black dark:text-white">Create</Link>
                <Link href="/profile" className="flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full grid place-items-center bg-black/10 dark:bg-white/10 text-black dark:text-white">👤</span>
                    )}
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/auth" className="rounded px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black">Get Started</Link>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="sm:hidden px-4 pb-3 space-y-2 bg-white dark:bg-black text-black dark:text-white">
          {!profile && (
            <>
              <Link href="/" className="block text-black dark:text-white">Home</Link>
              <Link href="#features" className="block text-black dark:text-white">Features</Link>
              <Link href="#testimonials" className="block text-black dark:text-white">Reviews</Link>
            </>
          )}
          {profile ? (
            <>
              <Link href="/confess" className="block text-black dark:text-white">Create</Link>
              <Link href="/profile" className="block text-black dark:text-white">Profile</Link>
            </>
          ) : (
            <Link href="/auth" className="block rounded px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black w-fit">Get Started</Link>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400 px-4 py-2">{error}</p>}
    </nav>
  );
}
