
const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// Display all posts
router.get("/", getAllPosts);

// Display the form to create a post
router.get("/new", (req, res) => {
  res.render("new");
});

// Create a post
router.post("/", createPost);

// Display the edit form
router.get("/:id/edit", editPost);

// Update a post
router.post("/:id/edit", updatePost);

// Delete a post
router.post("/:id/delete", deletePost);

// Display one post
router.get("/:id", getPostById);

module.exports = router;
