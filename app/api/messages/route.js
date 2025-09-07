import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import { hashDeterministic } from "@/lib/crypto";
import { isSensitive } from "@/lib/sensitive";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const { toUsername, text, nickname } = body || {};
  if (!toUsername || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const user = await User.findOne({ usernameHash: hashDeterministic(String(toUsername).toLowerCase()) });
  if (!user) return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  const message = await Message.create({
    toUser: user._id,
    text,
    sensitive: isSensitive(text),
    fromAnonymousNickname: nickname || null,
  });
  return NextResponse.json({ id: String(message._id) }, { status: 201 });
}

export async function GET() {
  await connectToDatabase();
  const token = getTokenFromCookies(cookies());
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const msgs = await Message.find({ toUser: payload.userId }).sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(msgs.map((m) => ({ id: String(m._id), text: m.text, sensitive: m.sensitive, from: m.fromAnonymousNickname || "Anonymous", createdAt: m.createdAt })));
}


