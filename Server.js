const express = require("express");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// EJS configuration
app.set("view engine", "ejs");
app.set("views", "./views");

// Home page
app.get("/", (req, res) => {
  res.render("home");
});

// Blog routes
app.use("/posts", postRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});