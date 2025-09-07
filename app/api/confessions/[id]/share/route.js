import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Confession from "@/models/Confession";

export async function POST(_request, { params }) {
  await connectToDatabase();
  const { id } = params;
  const doc = await Confession.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  doc.shares = (doc.shares || 0) + 1;
  await doc.save();
  return NextResponse.json({ success: true, shares: doc.shares });
}


