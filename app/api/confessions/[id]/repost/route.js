import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import Confession from "@/models/Confession";

function getUserId() {
  const token = getTokenFromCookies(cookies());
  const payload = token ? verifyToken(token) : null;
  return payload?.userId || null;
}

export async function POST(_req, context) {
  await connectToDatabase();
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const doc = await Confession.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const copy = await Confession.create({
    author: userId,
    title: doc.title,
    text: doc.text,
    sensitive: doc.sensitive,
    media: doc.media,
  });
  return NextResponse.json({ id: String(copy._id) }, { status: 201 });
}


