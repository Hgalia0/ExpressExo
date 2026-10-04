let posts = [];

const getAllPosts = () => {
  return posts;
};

const getPostById = (id) => {
  return posts.find((post) => post.id === Number(id));
};

const createPost = (title, content) => {
  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };

  posts.push(newPost);

  return newPost;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
};