const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();


// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));


// =====================
// SERVE FRONTEND
// =====================
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔥 SERVE UPLOADED IMAGES DRAG-DROP (VERY IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/user-needs", require("./src/routes/userNeeds"));
app.use("/api/contact", require("./src/routes/contact.routes"));
app.use("/api/newsletter", require("./src/routes/newsletter.routes"));
app.use("/api/designs", require("./src/routes/design.routes"));
app.use("/api/ai" , require("./src/routes/ai.route"));


// 🔥 SERVE AI IMAGE UPLOADS AND GENERATED IMAGES
app.use("/uploads_ai", express.static(path.join(__dirname, "uploads_ai")));
app.use("/generated_ai", express.static(path.join(__dirname, "generated_ai")));

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
