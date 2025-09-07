import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromAnonymousNickname: { type: String },
    text: { type: String, required: true },
    sensitive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);


