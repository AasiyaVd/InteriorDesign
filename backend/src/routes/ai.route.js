const express = require("express");
const router = express.Router();
const multer = require("multer");
const { generateRoomDesign } = require("../controllers/ai.controller");

const upload = multer({ dest: "uploads_ai/" });

router.post("/generate", upload.single("image"), generateRoomDesign);

module.exports = router;
