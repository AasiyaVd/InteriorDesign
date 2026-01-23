const express = require("express");
const path = require("path");

const app = express();

// middleware
app.use(express.json());

// 🔑 serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// APIs
app.use("/api/designs", require("./src/routes/design"));

// test
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



const userNeedsRoutes = require("./src/routes/userNeeds");

app.use(express.json());

app.use("/api/user-needs", userNeedsRoutes);

module.exports = app;

const contactRoutes = require("./src/routes/contact.routes");

app.use("/api/contact", contactRoutes);

