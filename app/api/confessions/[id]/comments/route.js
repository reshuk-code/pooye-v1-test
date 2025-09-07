import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import Comment from "@/models/Comment";
import Confession from "@/models/Confession";
import { isSensitive } from "@/lib/sensitive";

async function getUserId() {
  const cookieStore = await cookies();
  const token = getTokenFromCookies(cookieStore);
  const payload = token ? verifyToken(token) : null;
  return payload?.userId || null;
}

export async function GET(_req, context) {
  await connectToDatabase();
  const { id } = await context.params;
  const items = await Comment.find({ confession: id }).sort({ createdAt: 1 }).limit(200);
  const result = items.map((c) => ({ id: String(c._id), text: c.text, sensitive: c.sensitive, createdAt: c.createdAt, parent: c.parent ? String(c.parent) : null }));
  return NextResponse.json(result);
}

export async function POST(request, context) {
  await connectToDatabase();
  const { id } = await context.params;
  const userId = await getUserId();
  const body = await request.json();
  const { text, parent } = body || {};
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
  const ext = await Confession.findById(id);
  if (!ext) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const c = await Comment.create({ confession: id, author: userId || undefined, text, sensitive: isSensitive(text), parent: parent || null });
  return NextResponse.json({ id: String(c._id) }, { status: 201 });
}


