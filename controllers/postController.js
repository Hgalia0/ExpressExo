
const Post = require("../models/postModel");

// Display all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.render("posts", { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
};

// Display one post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("post", { post });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving post");
  }
};

// Create a post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    await Post.create({ title, content });

    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
};

// Display edit form
const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("edit", { post });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating post");
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting post");
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  updatePost,
  deletePost,
};
