"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState("");
  const [confessions, setConfessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [publicName, setPublicName] = useState("");
  const [editConfession, setEditConfession] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/profile", { cache: "no-store", origin: process.env.FRONTEND_URL  });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPublicName(data.publicName || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch("/api/confessions?author=me", { cache: "no-store", origin: process.env.FRONTEND_URL  }),
          fetch("/api/messages", { cache: "no-store", origin: process.env.FRONTEND_URL  }),
        ]);
        if (!cRes.ok) throw new Error("Failed to fetch confessions");
        if (!mRes.ok) throw new Error("Failed to fetch messages");
        setConfessions(await cRes.json());
        setMessages(await mRes.json());
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("email", email);
      form.append("publicName", publicName);
      if (avatar) {
        const reader = new FileReader();
        const b64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(avatar);
        });
        form.append("avatar", b64);
      }
      const res = await fetch("/api/profile", { method: "PUT", body: form, origin: process.env.FRONTEND_URL });
      if (!res.ok) throw new Error("Failed to update profile");
      setStatus("Saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteConfession(id) {
    if (!confirm("Are you sure you want to delete this confession?")) return;
    setLoading(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch(`/api/confessions/${id}`, { method: "DELETE" , origin: process.env.FRONTEND_URL});
      if (!res.ok) throw new Error("Failed to delete confession");
      setConfessions(confessions.filter((c) => c.id !== id));
      setStatus("Confession deleted");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveEditedConfession(e) {
    e.preventDefault();
    if (!editConfession) return;
    setLoading(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch(`/api/confessions/${editConfession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, text: editText }),
         origin: process.env.FRONTEND_URL
      });
      if (!res.ok) throw new Error("Failed to update confession");
      setConfessions((prev) =>
        prev.map((c) =>
          c.id === editConfession.id ? { ...c, title: editTitle, text: editText } : c
        )
      );
      setEditConfession(null);
      setEditTitle("");
      setEditText("");
      setStatus("Confession updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeProfile() {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setLoading(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch("/api/profile", { method: "DELETE", origin: process.env.FRONTEND_URL });
      if (!res.ok) throw new Error("Failed to delete account");
      location.assign("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !profile) return <div className="max-w-2xl mx-auto p-6 text-black dark:text-white">Loading...</div>;
  if (error && !profile) return <div className="max-w-2xl mx-auto p-6 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <section className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black shadow-md mb-6">
          <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black/10 dark:border-white/10"
                />
              ) : profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile picture"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black/10 dark:border-white/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-black dark:text-white font-medium">
                  {username.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2 flex-1">
              <input
                className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="email"
                className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                className="border border-black/10 dark:border-white/10 rounded px-3 py-2 sm:col-span-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                placeholder="Public display name (shown to others)"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="sm:col-span-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white dark:file:bg-white dark:file:text-black hover:file:bg-black/80 dark:hover:file:bg-white/80"
              />
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 hover:bg-black/80 dark:hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
                  disabled={loading || !username || !email}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={removeProfile}
                  className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 hover:bg-black/80 dark:hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
                  disabled={loading}
                >
                  Delete account
                </button>
              </div>
              {status && <p className="text-sm sm:col-span-2 text-green-600 dark:text-green-400">{status}</p>}
              {error && <p className="text-sm sm:col-span-2 text-red-600 dark:text-red-400">{error}</p>}
            </form>
          </div>
        </section>

        {editConfession && (
          <section className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Edit Confession</h2>
            <form onSubmit={saveEditedConfession} className="grid gap-4">
              <input
                className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Confession title"
                required
              />
              <textarea
                className="border border-black/10 dark:border-white/10 rounded px-3 py-2 min-h-[140px] bg-white dark:bg-black text-black dark:text-white"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Confession text (optional)"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditConfession(null)}
                  className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Your confessions</h2>
          <div className="grid gap-4">
            {confessions.map((c) => (
              <article key={c.id} className="border border-black/10 dark:border-white/10 rounded p-3 bg-white dark:bg-black shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate text-black dark:text-white">
                    {c.title || "Confession"}
                  </div>
                  <div className="relative">
                    <button
                      className="px-2 py-1 rounded border border-black/10 dark:border-white/10 text-black dark:text-white"
                      aria-label="Confession options"
                      onClick={(e) => {
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.classList.toggle("hidden");
                      }}
                    >
                      ⋯
                    </button>
                    <div className="absolute right-0 mt-2 hidden bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded shadow text-sm min-w-36 z-10">
                      <a
                        href={`/confessions/${c.id}`}
                        className="block px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white"
                      >
                        Open
                      </a>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white"
                        onClick={() => {
                          setEditConfession(c);
                          setEditTitle(c.title || "");
                          setEditText(c.text || "");
                          document.querySelectorAll(".absolute").forEach((el) => el.classList.add("hidden"));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this confession?")) {
                            deleteConfession(c.id);
                          }
                          document.querySelectorAll(".absolute").forEach((el) => el.classList.add("hidden"));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {c.text && (
                  <p className="whitespace-pre-wrap mt-2 text-sm text-black/70 dark:text-white/70">
                    {c.text}
                  </p>
                )}
              </article>
            ))}
            {confessions.length === 0 && (
              <p className="text-sm text-black/60 dark:text-white/60">No confessions yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your messages</h2>
          <div className="grid gap-4">
            {messages.map((m) => (
              <article key={m.id} className="border border-black/10 dark:border-white/10 rounded p-3 bg-white dark:bg-black shadow-sm">
                {m.sensitive && (
                  <span className="text-xs rounded bg-white/20 text-black dark:text-white px-2 py-0.5 mr-2">
                    Sensitive
                  </span>
                )}
                <p className="whitespace-pre-wrap text-black/70 dark:text-white/70">{m.text}</p>
                <p className="text-xs mt-1 text-black/60 dark:text-white/60">From: {m.from}</p>
              </article>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-black/60 dark:text-white/60">No messages yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}