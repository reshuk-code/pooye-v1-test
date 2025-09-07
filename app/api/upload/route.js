import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  const body = await request.json();
  const { fileBase64, folder } = body || {};
  if (!fileBase64) return NextResponse.json({ error: "Missing fileBase64" }, { status: 400 });
  const uploaded = await uploadToCloudinary(fileBase64, folder || "pooye/general");
  return NextResponse.json(uploaded);
}


