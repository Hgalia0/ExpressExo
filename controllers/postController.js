
const Post = require("../models/postModel");

// ==========================================
// EXISTING EJS CONTROLLERS
// ==========================================

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

// ==========================================
// NEW API CONTROLLERS FOR REACT
// ==========================================

// Get all posts
const getAllPostsAPI = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

// Get one post
const getPostByIdAPI = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving post" });
  }
};

// Create a post
const createPostAPI = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({ title, content });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
};

// Update a post
const updatePostAPI = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
};

// Delete a post
const deletePostAPI = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

// Export all controllers
module.exports = {
  // EJS
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  updatePost,
  deletePost,

  // React API
  getAllPostsAPI,
  getPostByIdAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
};
