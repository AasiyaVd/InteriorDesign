const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// SQLite DB connection
const db = new sqlite3.Database(path.join(__dirname, "../designs_ai.db"));

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    style TEXT,
    room_type TEXT,
    colors TEXT,
    lighting TEXT,
    before_image TEXT,
    after_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

exports.uploadRoomImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { style, room_type, colors, lighting } = req.body;

    const imagePath = req.file.filename; // better than full path

    const query = `
      INSERT INTO designs(style, room_type, colors, lighting, before_image)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [style, room_type, colors, lighting, imagePath], function (err) {
      if (err) {
        return res.status(500).json({
          message: "DB Insert Failed",
          error: err.message
        });
      }

      res.status(200).json({
        message: "Room image uploaded successfully",
        designId: this.lastID,
        beforeImage: imagePath
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateAfterImage = (designId, afterImagePath) => {
  const query = `UPDATE designs SET after_image = ? WHERE id = ?`;

  db.run(query, [afterImagePath, designId], function (err) {
    if (err) {
      console.error("Error updating after image:", err);
    } else {
      console.log("After image updated successfully for ID:", designId);
    }
  });
};