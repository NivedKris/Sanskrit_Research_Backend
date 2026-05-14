import express from "express";
import Comment from "../models/Comment.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:topicId", async (req, res) => {
  const comments = await Comment.find({ topicId: req.params.topicId })
    .sort({ timestamp: -1 })
    .lean();
  res.json(comments);
});

router.get("/:topicId/count", async (req, res) => {
  const count = await Comment.countDocuments({ topicId: req.params.topicId });
  res.json({ count });
});

router.post("/:topicId", verifyFirebaseToken, async (req, res) => {
  const { text, name, photoURL, timestamp } = req.body;
  if (!text || !name || !timestamp) {
    return res.status(400).json({ error: "Missing comment fields" });
  }

  const comment = await Comment.create({
    topicId: req.params.topicId,
    uid: req.user.uid,
    name,
    photoURL: photoURL || "",
    text,
    timestamp: new Date(timestamp)
  });

  res.status(201).json(comment);
});

router.put("/:commentId", verifyFirebaseToken, async (req, res) => {
  const { text } = req.body;
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  if (comment.uid !== req.user.uid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  comment.text = text || comment.text;
  await comment.save();
  res.json(comment);
});

router.delete("/:commentId", verifyFirebaseToken, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  if (comment.uid !== req.user.uid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await comment.deleteOne();
  res.json({ success: true });
});

export default router;
