
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT token to requests when the user is logged in.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// GET: Fetch all posts (public)
export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

// CREATE: Add a post (requires login)
export const createPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

// UPDATE: Edit a post (requires login)
export const updatePost = async (id, postData) => {
  const response = await api.put(
    `/posts/${encodeURIComponent(id)}`,
    postData
  );
  return response.data;
};

// DELETE: Remove a post (requires login)
export const deletePost = async (id) => {
  const response = await api.delete(
    `/posts/${encodeURIComponent(id)}`
  );
  return response.data;
};

export default api;
