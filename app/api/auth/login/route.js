import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { hashDeterministic, decryptString } from "@/lib/crypto";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const { emailOrUsername, password } = body || {};
  if (!emailOrUsername || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const key = emailOrUsername.toLowerCase();
  const user = await User.findOne({
    $or: [
      { emailHash: hashDeterministic(key) },
      { usernameHash: hashDeterministic(key) },
    ],
  });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ userId: user._id });
  const res = NextResponse.json({
    success: true,
    profile: {
      id: String(user._id),
      username: (() => {
        try {
          return decryptString(user.usernameEnc);
        } catch {
          return "";
        }
      })(),
      avatar: user.avatar?.url || null,
    },
  });
  setAuthCookie(res.cookies, token);
  return res;
}


