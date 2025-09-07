"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import ImageCropper from "@/app/components/ImageCropper";

export default function ConfessPage() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "video/mp4", "application/pdf"];

  async function readFilesToBase64WithCrop(fileList) {
    const readers = Array.from(fileList).map(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > MAX_FILE_SIZE) return reject(new Error(`File ${file.name} exceeds 5MB limit`));
          if (!ALLOWED_TYPES.includes(file.type)) return reject(new Error(`File type ${file.type} not supported`));
          const reader = new FileReader();
          reader.onload = () => resolve({ b64: reader.result, type: file.type });
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(readers);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      formData.append("files", JSON.stringify(files));
      const res = await fetch("/api/confessions", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");
      setTitle("");
      setText("");
      setFiles([]);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Create a confession</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            required
            className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white"
            placeholder="Confession title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border border-black/10 dark:border-white/10 rounded px-3 py-2 min-h-[140px] bg-white dark:bg-black text-black dark:text-white"
            placeholder="Write your confession (optional)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            multiple
            accept={ALLOWED_TYPES.join(",")}
            onChange={async (e) => {
              try {
                const items = await readFilesToBase64WithCrop(e.target.files || []);
                setFiles((prev) => [...prev, ...items.map((it) => it.b64)]);
              } catch (err) {
                setError(err.message);
              }
            }}
            className="border border-black/10 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black text-black dark:text-white"
          />
          {files.length > 0 && files[files.length - 1].startsWith("data:image") && (
            <div className="grid gap-2">
              <p className="text-sm text-black/60 dark:text-white/60">Optional: crop the last selected image</p>
              <ImageCropper
                src={files[files.length - 1]}
                aspect={1}
                onCropped={(cropped) => {
                  setFiles((prev) => {
                    const clone = prev.slice();
                    clone[clone.length - 1] = cropped;
                    return clone;
                  });
                }}
              />
            </div>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post confession"}
          </button>
        </form>
      </div>
    </div>
  );
}