import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Confession from "@/models/Confession";

export async function POST(_request, context) {
  await connectToDatabase();
  const { id } = await context.params;
  const { searchParams } = new URL(_request.url);
  const type = searchParams.get("type") || "like";
  const doc = await Confession.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const current = doc.reactions.get(type) || { type, count: 0 };
  current.count += 1;
  doc.reactions.set(type, current);
  await doc.save();
  return NextResponse.json({ success: true, reactions: Object.fromEntries(doc.reactions) });
}


