const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




const express = require("express");
const userNeedsRoutes = require("./src/routes/userNeeds");

app.use(express.json());

app.use("/api/user-needs", userNeedsRoutes);

module.exports = app;

