const express = require("express");
const multer = require("multer");
const {
  uploadRoomImage,
  generateAIImage,
  getDesignById
} = require("../controllers/ai.controller");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_ai/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload room image
router.post("/upload-room", upload.single("roomImage"), uploadRoomImage);

// Generate AI image
router.post("/generate-ai", generateAIImage);

// Get design by ID
router.get("/design/:designId", getDesignById);

module.exports = router;
