
const express = require("express");

const {
  getAllPostsAPI,
  getPostByIdAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes: anyone can read posts
router.get("/", getAllPostsAPI);
router.get("/:id", getPostByIdAPI);

// Protected routes: login and a valid JWT are required
router.post("/", authMiddleware, createPostAPI);
router.put("/:id", authMiddleware, updatePostAPI);
router.delete("/:id", authMiddleware, deletePostAPI);

module.exports = router;
