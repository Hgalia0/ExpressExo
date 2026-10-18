
import { useCallback, useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "./api";

const styles = {
  page: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#24332d",
  },
  panel: {
    border: "1px solid #dfe5e0",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "28px",
    background: "#fff",
  },
  input: {
    boxSizing: "border-box",
    display: "block",
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #ccd5ce",
    borderRadius: "7px",
    fontSize: "15px",
  },
  label: {
    display: "block",
    marginBottom: "18px",
    fontWeight: "600",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

const API_URL = "http://localhost:3000/api";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && token);

  // REGISTER / LOGIN
  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const isRegister = authMode === "register";

      const response = await fetch(
        `${API_URL}/auth/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isRegister
              ? authForm
              : {
                  email: authForm.email,
                  password: authForm.password,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setAuthForm({ username: "", email: "", password: "" });
      setError("");
      setSuccess("");
    } catch (err) {
      setAuthError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that your server is running."
          : err.message
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPosts([]);
    setTitle("");
    setContent("");
    setEditingId(null);
    setError("");
    setSuccess("");
    setAuthError("");
    setAuthMode("login");
  };

  // READ: Public posts
  const fetchPosts = useCallback(async () => {
    const data = await getPosts();

    if (!Array.isArray(data)) {
      throw new Error("The API did not return a list of posts.");
    }

    setPosts(data);
  }, []);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        const data = await getPosts();

        if (!Array.isArray(data)) {
          throw new Error("The API did not return a list of posts.");
        }

        if (active) {
          setPosts(data);
          setError("");
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError("Could not load posts. Check your backend.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // CREATE / UPDATE
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isLoggedIn) {
      setError("Please log in before creating or editing posts.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        await updatePost(editingId, {
          title: trimmedTitle,
          content: trimmedContent,
        });

        await fetchPosts();
        setSuccess("Post updated successfully!");
      } else {
        await createPost({
          title: trimmedTitle,
          content: trimmedContent,
        });

        await fetchPosts();
        setSuccess("Post created successfully!");
      }

      setTitle("");
      setContent("");
      setEditingId(null);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Your session may have expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "The operation failed."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    if (!isLoggedIn) {
      setError("Please log in to edit posts.");
      return;
    }

    setEditingId(post._id);
    setTitle(post.title || "");
    setContent(post.content || "");
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (post) => {
    if (!isLoggedIn) {
      setError("Please log in to delete posts.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deletePost(post._id);

      setPosts((currentPosts) =>
        currentPosts.filter((item) => item._id !== post._id)
      );

      if (editingId === post._id) resetForm();

      setSuccess("Post deleted successfully!");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Your session may have expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message || "Could not delete the post."
        );
      }
    }
  };

  return (
    <main style={styles.page}>
      <header
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "#39745a",
              fontWeight: "700",
              letterSpacing: "2px",
              fontSize: "12px",
            }}
          >
            MY PERSONAL BLOG
          </p>

          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
            My Blog
          </h1>

          <p style={{ color: "#6b7770" }}>
            Create, read, update and delete your posts.
          </p>
        </div>

        {isLoggedIn && (
          <div>
            <p>
              Welcome, <strong>{user.username}</strong>
            </p>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                ...styles.button,
                background: "#edf1ed",
                color: "#24332d",
              }}
            >
              Log out
            </button>
          </div>
        )}
      </header>

      {/* AUTHENTICATION */}
      {!isLoggedIn && (
        <section style={styles.panel}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
              style={{
                ...styles.button,
                background: authMode === "login" ? "#245c45" : "#edf1ed",
                color: authMode === "login" ? "#fff" : "#24332d",
              }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
              }}
              style={{
                ...styles.button,
                background: authMode === "register" ? "#245c45" : "#edf1ed",
                color: authMode === "register" ? "#fff" : "#24332d",
              }}
            >
              Register
            </button>
          </div>

          <h2 style={{ marginTop: 0 }}>
            {authMode === "register" ? "Create an account" : "Welcome back"}
          </h2>

          <form onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label style={styles.label} htmlFor="username">
                Username
                <input
                  id="username"
                  style={styles.input}
                  value={authForm.username}
                  onChange={(event) =>
                    setAuthForm({
                      ...authForm,
                      username: event.target.value,
                    })
                  }
                  autoComplete="username"
                  required
                />
              </label>
            )}

            <label style={styles.label} htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                style={styles.input}
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm({
                    ...authForm,
                    email: event.target.value,
                  })
                }
                autoComplete="email"
                required
              />
            </label>

            <label style={styles.label} htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                style={styles.input}
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm({
                    ...authForm,
                    password: event.target.value,
                  })
                }
                minLength={authMode === "register" ? 8 : undefined}
                autoComplete={
                  authMode === "register" ? "new-password" : "current-password"
                }
                required
              />
            </label>

            {authError && (
              <p role="alert" style={{ color: "#b42318" }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              style={{
                ...styles.button,
                background: "#245c45",
                color: "#fff",
                opacity: authLoading ? 0.65 : 1,
              }}
            >
              {authLoading
                ? "Please wait..."
                : authMode === "register"
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>
        </section>
      )}

      {/* CREATE / UPDATE */}
      {isLoggedIn && (
        <section style={styles.panel}>
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Post" : "Create a Post"}
          </h2>

          <form onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="title">
              Title
              <input
                id="title"
                style={styles.input}
                type="text"
                placeholder="Enter your post title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                required
              />
            </label>

            <label style={styles.label} htmlFor="content">
              Content
              <textarea
                id="content"
                style={{
                  ...styles.input,
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                placeholder="Write something..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                required
              />
            </label>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.button,
                  background: "#245c45",
                  color: "white",
                  opacity: submitting ? 0.65 : 1,
                }}
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Post"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    ...styles.button,
                    background: "#edf1ed",
                    color: "#24332d",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {error && (
        <p role="alert" style={{ color: "#b42318" }}>
          {error}
        </p>
      )}

      {success && (
        <p role="status" style={{ color: "#237447" }}>
          {success}
        </p>
      )}

      {/* READ POSTS */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ margin: 0 }}>All Posts</h2>
          <span style={{ color: "#6b7770" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <div style={styles.panel}>
            <p>No posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post._id}
              style={{ ...styles.panel, marginBottom: "16px" }}
            >
              <h3 style={{ marginTop: 0, fontSize: "22px" }}>
                {post.title}
              </h3>

              <p
                style={{
                  color: "#526158",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  overflowWrap: "anywhere",
                }}
              >
                {post.content}
              </p>

              {isLoggedIn && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEdit(post)}
                    style={{
                      ...styles.button,
                      background: "#e6f0e9",
                      color: "#245c45",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    style={{
                      ...styles.button,
                      background: "#fff0ef",
                      color: "#b42318",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
