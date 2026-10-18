
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const apiPostRoutes = require("./routes/apiPostRoutes");

const authRoutes = require("./routes/authRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// EJS configuration (keep your existing pages)
app.set("view engine", "ejs");
app.set("views", "./views");

// Existing EJS home page
app.get("/", (req, res) => {
  res.render("home");
});

// EJS routes — HTML pages
app.use("/posts", postRoutes);

// API routes — JSON for React
app.use("/api/posts", apiPostRoutes);

app.use("/api/auth", authRoutes);


// Keep your existing EJS routes temporarily
// We will separate their HTML responses from the API responses next.

// 404 handler
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      message: "API endpoint not found",
    });
  }

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
