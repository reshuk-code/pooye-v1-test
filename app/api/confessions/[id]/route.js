import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import Confession from "@/models/Confession";

async function getUserId() {
  const cookieStore = await cookies();
  const token = getTokenFromCookies(cookieStore);
  const payload = token ? verifyToken(token) : null;
  return payload?.userId || null;
}

export async function GET(_request, context) {
  await connectToDatabase();
  const { id } = await context.params;
  const c = await Confession.findById(id).populate("author", "avatar usernameEnc publicName");
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
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
  });
}

export async function PUT(request, context) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const { id } = await context.params;
  const body = await request.json();
  const { text, title } = body || {};
  const doc = await Confession.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (String(doc.author) !== String(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (text !== undefined) doc.text = text;
  if (title !== undefined) doc.title = title;
  await doc.save();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request, context) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const { id } = await context.params;
  const doc = await Confession.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (String(doc.author) !== String(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await doc.deleteOne();
  return NextResponse.json({ success: true });
}


