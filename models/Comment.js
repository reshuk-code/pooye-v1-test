import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    confession: { type: mongoose.Schema.Types.ObjectId, ref: "Confession", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    sensitive: { type: Boolean, default: false },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);