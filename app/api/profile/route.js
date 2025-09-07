import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { decryptString, encryptString, hashDeterministic } from "@/lib/crypto";
import { uploadToCloudinary } from "@/lib/cloudinary";

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = getTokenFromCookies(cookieStore);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return null;
  await connectToDatabase();
  return User.findById(payload.userId);
}

export async function GET() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    id: String(user._id),
    username: (() => { try { return decryptString(user.usernameEnc); } catch { return ""; } })(),
    email: (() => { try { return decryptString(user.emailEnc); } catch { return ""; } })(),
    publicName: user.publicName || "",
    avatar: user.avatar?.url || null,
  });
}

export async function PUT(request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const publicName = formData.get("publicName");
  const avatarBase64 = formData.get("avatar");

  if (username) {
    user.usernameEnc = encryptString(username);
    user.usernameHash = hashDeterministic(username.toLowerCase());
  }
  if (email) {
    user.emailEnc = encryptString(email);
    user.emailHash = hashDeterministic(email.toLowerCase());
  }
  if (publicName !== undefined) {
    user.publicName = String(publicName);
  }
  if (avatarBase64) {
    const uploaded = await uploadToCloudinary(avatarBase64, "pooye/avatars");
    user.avatar = { publicId: uploaded.publicId, url: uploaded.url };
  }
  await user.save();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await user.deleteOne();
  return NextResponse.json({ success: true });
}


