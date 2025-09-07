import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import Confession from "@/models/Confession";
import { isSensitive } from "@/lib/sensitive";
import { uploadToCloudinary } from "@/lib/cloudinary";

async function getUserId() {
  const token = getTokenFromCookies(cookies());
  const payload = token ? verifyToken(token) : null;
  return payload?.userId || null;
}

export async function GET(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const author = searchParams.get("author");
  const meId = author === "me" ? (await (async () => {
    const token = getTokenFromCookies(cookies());
    const payload = token ? verifyToken(token) : null;
    return payload?.userId || null;
  })()) : null;
  const filter = {
    ...(q ? { text: { $regex: q, $options: "i" } } : {}),
    ...(meId ? { author: meId } : {}),
  };
  const items = await Confession.find(filter).sort({ createdAt: -1 }).limit(50).populate("author", "avatar usernameEnc publicName");
  return NextResponse.json(items.map((c) => ({
    id: String(c._id),
    title: c.title,
    text: c.text,
    sensitive: c.sensitive,
    media: c.media,
    reactions: Object.fromEntries(c.reactions || []),
    shares: c.shares,
    author: {
      id: String(c.author?._id || ""),
      avatar: c.author?.avatar?.url || null,
    },
    authorName: c.author?.publicName || "Anonymous User",
    createdAt: c.createdAt,
  })));
}

export async function POST(request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const formData = await request.formData();
  const title = formData.get("title") || "";
  const text = formData.get("text") || "";
  const files = JSON.parse(formData.get("files") || "[]"); // array of base64 strings
  const uploads = [];
  for (const f of files) {
    const up = await uploadToCloudinary(f, "pooye/confessions");
    uploads.push(up);
  }
  const doc = await Confession.create({
    author: userId,
    title,
    text,
    sensitive: isSensitive(text),
    media: uploads,
  });
  return NextResponse.json({ id: String(doc._id) }, { status: 201 });
}


