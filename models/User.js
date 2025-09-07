import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    usernameEnc: { type: String, required: true },
    emailEnc: { type: String, required: true },
    usernameHash: { type: String, required: true, unique: true, index: true },
    emailHash: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    publicName: { type: String },
    avatar: {
      publicId: String,
      url: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);


