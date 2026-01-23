const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// SERVE FRONTEND
// =====================
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔥 SERVE UPLOADED IMAGES (VERY IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/designs", require("./src/routes/design"));
app.use("/api/user-needs", require("./src/routes/userNeeds"));
app.use("/api/contact", require("./src/routes/contact.routes"));

// =====================
// HEALTH CHECK
// =====================
app.get("/health", (req, res) => {
  res.send("OK");
});

// =====================
// START SERVER
// =====================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
