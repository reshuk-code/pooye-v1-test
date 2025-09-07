"use client";
import Image from "next/image";
import AudioPlayer from "@/app/components/AudioPlayer";

export default function MediaRenderer({ media }) {
  if (!Array.isArray(media) || media.length === 0) return null;
  return (
    <div className="flex gap-3 flex-wrap items-start">
      {media.map((m, idx) => {
        const key = `${m.publicId || m.url || idx}`;
        if (m.resourceType === "image") {
          return (
            <Image key={key} src={m.url} alt="image" width={320} height={240} className="rounded border h-auto max-w-full" />
          );
        }
        if (m.resourceType === "video") {
          return (
            <video key={key} controls className="w-full max-w-[480px] rounded border">
              <source src={m.url} />
            </video>
          );
        }
        if (m.resourceType === "raw" && (m.format === "mp3" || m.format === "wav" || m.format === "m4a")) {
          return <AudioPlayer key={key} src={m.url} />;
        }
        return (
          <a key={key} href={m.url} target="_blank" className="underline break-all text-sm">{m.resourceType}/{m.format} file</a>
        );
      })}
    </div>
  );
}


