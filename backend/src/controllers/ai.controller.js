const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

// === Database setup ===
const db = new sqlite3.Database("./designs.db", (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to SQLite DB");
});

// 1️⃣ Upload room image & save selections
exports.uploadRoomImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const { style, room_type, colors, lighting } = req.body;
    const beforeImagePath = req.file.path;

    db.run(
      `INSERT INTO designs (style, room_type, colors, before_image) VALUES (?, ?, ?, ?)`,
      [style, room_type, colors, beforeImagePath],
      function (err) {
        if (err) return res.status(500).json({ message: "DB error" });

        res.status(200).json({
          message: "Room image uploaded successfully",
          designId: this.lastID,
          beforeImage: beforeImagePath
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 2️⃣ Generate AI image
exports.generateAIImage = async (req, res) => {
  try {
    const { designId } = req.body;
    if (!designId) return res.status(400).json({ message: "Missing designId" });

    db.get(`SELECT * FROM designs WHERE id = ?`, [designId], async (err, row) => {
      if (err || !row) return res.status(404).json({ message: "Design not found" });

      const beforeImagePath = row.before_image;

      // Simulate AI generation (replace with real AI API)
      const afterImageName = "after_" + path.basename(beforeImagePath);
      const afterImagePath = path.join("generated_ai", afterImageName);

      fs.copyFile(beforeImagePath, afterImagePath, (copyErr) => {
        if (copyErr) return res.status(500).json({ message: "Failed to generate AI image" });

        db.run(
          `UPDATE designs SET after_image = ? WHERE id = ?`,
          [afterImagePath, designId],
          (updateErr) => {
            if (updateErr) return res.status(500).json({ message: "Failed to update design" });

            res.status(200).json({
              designId,
              before: beforeImagePath,
              after: afterImagePath
            });
          }
        );
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 3️⃣ Get design by ID (optional)
exports.getDesignById = (req, res) => {
  const { designId } = req.params;
  db.get(`SELECT * FROM designs WHERE id = ?`, [designId], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "Design not found" });

    res.status(200).json({
      designId: row.id,
      style: row.style,
      room_type: row.room_type,
      colors: row.colors,
      before: row.before_image,
      after: row.after_image
    });
  });
};
