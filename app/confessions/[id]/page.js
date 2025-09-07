"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import MediaRenderer from "@/app/components/MediaRenderer";
import { useParams } from "next/navigation";
import { MoreHorizontal, Share2, Copy, Reply } from "lucide-react";

export default function ConfessionDetail() {
  const params = useParams();
  const id = params?.id;
  const [conf, setConf] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid confession ID");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [confRes, commentsRes] = await Promise.all([
          fetch(`/api/confessions/${id}`, { cache: "no-store" }),
          fetch(`/api/confessions/${id}/comments`, { cache: "no-store" }),
        ]);
        if (!confRes.ok) throw new Error("Failed to fetch confession");
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");
        setConf(await confRes.json());
        setComments(await commentsRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function addComment(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/confessions/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parent: replyTo }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      setText("");
      setReplyTo(null);
      const refresh = await fetch(`/api/confessions/${id}/comments`, { cache: "no-store" });
      if (!refresh.ok) throw new Error("Failed to refresh comments");
      setComments(await refresh.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = () => {
    if (conf) {
      const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/confessions/${conf.id}`;
      navigator.clipboard.writeText(shareUrl);
    }
    setIsMenuOpen(false);
  };

  const handleShare = () => {
    if (conf) {
      const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/confessions/${conf.id}`;
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    }
    setIsMenuOpen(false);
  };

  if (loading) return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 text-red-600 dark:text-red-400">{error}</div>
    </div>
  );
  if (!conf) return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">No confession found</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 grid gap-4">
        <header className="border-b border-black/10 dark:border-white/10 pb-3 relative">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">{conf.title || "Confession"}</h1>
              <p className="text-sm text-black/60 dark:text-white/60">{conf.authorName || "Anonymous User"}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {conf.text && <p className="whitespace-pre-wrap">{conf.text}</p>}
        {Array.isArray(conf.media) && conf.media.length > 0 && (
          <MediaRenderer media={conf.media} />
        )}
        <section className="border-t border-black/10 dark:border-white/10 pt-4">
          <h2 className="font-medium mb-2">Comments</h2>
          <form onSubmit={addComment} className="grid gap-2 mb-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Write a comment"}
              className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white"
            />
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                <span>Replying to comment {replyTo}</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-red-600 dark:text-red-400"
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              disabled={loading}
              className="px-3 py-1.5 rounded bg-black text-white dark:bg-white dark:text-black w-max disabled:opacity-50"
            >
              {loading ? "Posting..." : replyTo ? "Reply" : "Comment"}
            </button>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </form>
          <div className="grid gap-2 mt-4">
            {comments.map((c) => (
              <article key={c.id} className="border border-black/10 dark:border-white/10 rounded p-3 text-sm">
                {c.sensitive && (
                  <span className="text-[10px] rounded bg-white/20 text-black dark:text-white px-2 py-0.5 mr-2">Sensitive</span>
                )}
                <span className="whitespace-pre-wrap">{c.text}</span>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setReplyTo(c.id)}
                    className="text-xs flex items-center text-black dark:text-white hover:underline"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </button>
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-2 pl-2 border-l border-black/10 dark:border-white/10">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="mt-2 text-sm">
                          <span className="text-black/60 dark:text-white/60">
                            {reply.authorName || "Anonymous"}:
                          </span>{" "}
                          <span className="whitespace-pre-wrap">{reply.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {comments.length === 0 && <p className="text-sm text-black/60 dark:text-white/60">No comments yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}