import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set");
  try {
    const buf = Buffer.from(key, "base64");
    if (buf.length === 32) return buf;
  } catch {}
  const buf = Buffer.alloc(32);
  buf.write(key);
  return buf;
}

export function encryptString(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptString(payload) {
  const [ivB64, tagB64, dataB64] = String(payload).split(".");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

export function hashDeterministic(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}