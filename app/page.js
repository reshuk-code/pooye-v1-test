"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import ConfessionList from "@/app/components/ConfessionList";

export default function Home() {
  const [search, setSearch] = useState("");
  const [toUser, setToUser] = useState("");
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store", origin: process.env.FRONTEND_URL });
        if (!res.ok) throw new Error("Failed to fetch profile");
        setProfile(await res.json());
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  async function sendAnonymousMessage(e) {
    e.preventDefault();
    if (message.length > 500) {
      setError("Message is too long (max 500 characters)");
      return;
    }
    setStatus("");
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUsername: toUser, text: message, nickname }),
         origin: process.env.FRONTEND_URL
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setStatus("Message sent!");
      setMessage("");
      setToUser("");
      setNickname("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 pt-10 pb-8 grid gap-6">
        <h1 className="text-3xl sm:text-5xl font-bold">Confess, React, and Share — Anonymously</h1>
        <p className="text-base sm:text-lg text-black/70 dark:text-white/70">
          Browse confessions, post with media, and send direct anonymous messages. Secure and private by design.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {profile ? (
            <a href="/confess" className="rounded px-4 py-2 border border-black/10 dark:border-white/10 text-black dark:text-white w-full sm:w-auto">
              Create
            </a>
          ) : (
            <a href="/auth" className="rounded px-4 py-2 bg-black text-white dark:bg-white dark:text-black w-full sm:w-auto">
              Get Started
            </a>
          )}
          <form action="/" className="flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search confessions..."
              className="w-full border border-black/10 dark:border-white/10 px-3 py-2 rounded bg-white dark:bg-black text-black dark:text-white"
            />
          </form>
        </div>
      </header>

      <section id="features" className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-4">
        <div className="border border-black/10 dark:border-white/10 rounded p-4 bg-white dark:bg-black">
          <h3 className="font-semibold mb-1">Anonymous messaging</h3>
          <p>Send direct messages to any user without an account.</p>
        </div>
        <div className="border border-black/10 dark:border-white/10 rounded p-4 bg-white dark:bg-black">
          <h3 className="font-semibold mb-1">Rich media confessions</h3>
          <p>Attach images, videos, PDFs, docs, GIFs, and MP3s via Cloudinary.</p>
        </div>
        <div className="border border-black/10 dark:border-white/10 rounded p-4 bg-white dark:bg-black">
          <h3 className="font-semibold mb-1">Sensitive content detection</h3>
          <p>Auto-labels explicit content to keep feeds safer.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-3">Send an anonymous message</h2>
        <form onSubmit={sendAnonymousMessage} className="grid gap-3 sm:grid-cols-2">
          <input
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
            required
            placeholder="Recipient username"
            className="border border-black/10 dark:border-white/10 px-3 py-2 rounded bg-white dark:bg-black text-black dark:text-white"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your nickname (optional)"
            className="border border-black/10 dark:border-white/10 px-3 py-2 rounded bg-white dark:bg-black text-black dark:text-white"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Your message"
            className="border border-black/10 dark:border-white/10 px-3 py-2 rounded sm:col-span-2 bg-white dark:bg-black text-black dark:text-white"
          />
          <button
            className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 sm:col-span-2 hover:bg-black/80 dark:hover:bg-white/80"
          >
            Send
          </button>
          {status && <p className="text-sm sm:col-span-2 text-green-600 dark:text-green-400">{status}</p>}
          {error && <p className="text-sm sm:col-span-2 text-red-600 dark:text-red-400">{error}</p>}
        </form>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-3">Latest confessions</h2>
        <ConfessionList query={search} />
      </section>
    </div>
  );
}