import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
  },
  { _id: false }
);

const ReactionSchema = new mongoose.Schema(
  {
    type: { type: String, default: "like" },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const ConfessionSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    text: { type: String },
    sensitive: { type: Boolean, default: false },
    media: [MediaSchema],
    reactions: { type: Map, of: ReactionSchema, default: {} },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Confession || mongoose.model("Confession", ConfessionSchema);