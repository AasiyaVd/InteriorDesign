const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const designRoutes = require("./routes/design");
const userNeedsRoutes = require("./routes/userNeeds");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/user-needs", userNeedsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

module.exports = app;
