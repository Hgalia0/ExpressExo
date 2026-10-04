const {
  getAllPosts,
  getPostById,
  createPost,
} = require("../models/postModel");

// GET /posts
const getPosts = (req, res) => {
  const posts = getAllPosts();

  res.render("posts", {
    posts,
  });
};

// GET /posts/:id
const getPost = (req, res) => {
  const post = getPostById(req.params.id);

  if (!post) {
    return res.status(404).render("404");
  }

  res.render("post", {
    post,
  });
};

// POST /posts
const addPost = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  const newPost = createPost(title, content);

  res.status(201).json(newPost);
};

module.exports = {
  getPosts,
  getPost,
  addPost,
};