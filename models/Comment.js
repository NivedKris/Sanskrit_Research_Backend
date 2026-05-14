import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, index: true },
    uid: { type: String, required: true },
    name: { type: String, required: true },
    photoURL: { type: String, default: "" },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
