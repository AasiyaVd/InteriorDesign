const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/designs",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `design_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;