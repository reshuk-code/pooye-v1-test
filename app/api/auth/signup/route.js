import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { encryptString, hashDeterministic } from "@/lib/crypto";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const { email, username, password } = body || {};
  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const emailHash = hashDeterministic(email.toLowerCase());
  const usernameHash = hashDeterministic(username.toLowerCase());
  const existing = await User.findOne({ $or: [{ emailHash }, { usernameHash }] });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const user = await User.create({
    emailEnc: encryptString(email),
    usernameEnc: encryptString(username),
    emailHash,
    usernameHash,
    passwordHash: await hashPassword(password),
  });

  const token = signToken({ userId: user._id });
  const res = NextResponse.json({ success: true });
  setAuthCookie(res.cookies, token);
  return res;
}


