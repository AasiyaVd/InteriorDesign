const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const userNeedsRoutes = require("./routes/userNeeds");
const designRoutes = require("./routes/design.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/user-needs", userNeedsRoutes);
app.use("/api/designs", designRoutes);


module.exports = app;