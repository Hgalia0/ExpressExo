
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Connect to MongoDB, then start the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
