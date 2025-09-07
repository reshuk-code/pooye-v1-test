import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_COOKIE = "pooye_token";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function setAuthCookie(cookies, token) {
  cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(cookies) {
  cookies.set(TOKEN_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export function getTokenFromCookies(cookies) {
  return cookies.get(TOKEN_COOKIE)?.value || null;
}


