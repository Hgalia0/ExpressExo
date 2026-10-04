
const express = require("express");

const {
  getPosts,
  getPost,
  addPost,
} = require("../controllers/postController");

const router = express.Router();

// GET /posts
router.get("/", getPosts);

// GET /posts/:id
router.get("/:id", getPost);

// POST /posts
router.post("/", addPost);

module.exports = router;