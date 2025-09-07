"use client";
import { useEffect, useState } from "react";
import MediaRenderer from "@/app/components/MediaRenderer";

export default function ConfessionList({ query }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const url = query ? `/api/confessions?q=${encodeURIComponent(query)}` : "/api/confessions";
        const res = await fetch(url, { signal: controller.signal, cache: "no-store", origin: process.env.FRONTEND_URL });
        if (!res.ok) throw new Error("Failed to fetch confessions");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [query]);

  async function react(id, type = "like") {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const originalItems = [...items];
    setItems((prev) =>
      prev.map((c) =>
        c.id !== id
          ? c
          : {
              ...c,
              reactions: {
                ...(c.reactions || {}),
                [type]: { type, count: ((c.reactions?.[type]?.count || 0) + 1) },
              },
            }
      )
    );
    try {
      const res = await fetch(`/api/confessions/${id}/react?type=${encodeURIComponent(type)}`, { method: "POST", origin: process.env.FRONTEND_URL });
      if (!res.ok) throw new Error("Failed to react");
    } catch (error) {
      console.error("React error:", error);
      setItems(originalItems); // Rollback on error
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function share(id) {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const originalItems = [...items];
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, shares: (c.shares || 0) + 1 } : c)));
    try {
      const res = await fetch(`/api/confessions/${id}/share`, { method: "POST" , origin: process.env.FRONTEND_URL});
      if (!res.ok) throw new Error("Failed to share");
    } catch (error) {
      console.error("Share error:", error);
      setItems(originalItems); // Rollback on error
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function repost(id) {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/confessions/${id}/repost`, { method: "POST" , origin: process.env.FRONTEND_URL});
      if (!res.ok) throw new Error("Failed to repost");
    } catch (error) {
      console.error("Repost error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-6 text-black dark:text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 grid gap-6">
      {items.map((c) => (
        <article key={c.id} className="rounded border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 overflow-hidden">
          <div className="p-3 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 grid place-items-center text-black dark:text-white">👤</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {c.title ? <h3 className="font-medium truncate text-black dark:text-white">{c.title}</h3> : null}
                <span className="text-xs text-black/60 dark:text-white/60">· {new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-black/60 dark:text-white/60 truncate">{c.authorName || "Anonymous User"}</p>
            </div>
            {c.sensitive && (
              <span className="text-[10px] rounded bg-white/20 text-black dark:text-white px-2 py-0.5">Sensitive</span>
            )}
          </div>
          {c.text && (
            <a href={`/confessions/${c.id}`} className="block whitespace-pre-wrap p-4 pt-3 hover:underline text-black dark:text-white">
              {c.text}
            </a>
          )}
          {Array.isArray(c.media) && c.media.length > 0 && (
            <div className="p-4 pt-0">
              <MediaRenderer media={c.media} />
            </div>
          )}
          <div className="flex items-center gap-3 text-sm p-4 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => react(c.id, "like")}
              disabled={actionLoading[c.id]}
              className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/10 text-black dark:text-white disabled:opacity-50"
            >
              👍 {c.reactions?.like?.count || 0}
            </button>
            <button
              onClick={() => share(c.id)}
              disabled={actionLoading[c.id]}
              className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/10 text-black dark:text-white disabled:opacity-50"
            >
              Share {c.shares || 0}
            </button>
            <button
              onClick={() => repost(c.id)}
              disabled={actionLoading[c.id]}
              className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/10 text-black dark:text-white disabled:opacity-50"
            >
              Repost
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/confessions/${c.id}`)}
              className="px-3 py-1.5 rounded border border-black/10 dark:border-white/10 text-black dark:text-white"
            >
              Copy link
            </button>
          </div>
        </article>
      ))}
      {items.length === 0 && <p className="py-6 text-sm text-black/60 dark:text-white/60">No confessions yet.</p>}
    </div>
  );
}