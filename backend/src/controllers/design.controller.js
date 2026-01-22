const prisma = require("../prisma");

const saveDesign = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;

    const design = await prisma.design.create({
      data: {
        title,
        imagePath,
        userId: null
      }
    });

    res.status(201).json({
      success: true,
      design
    });
  } catch (err) {
    console.error("SAVE DESIGN ERROR:", err);
    res.status(500).json({ error: "Failed to save design" });
  }
};

module.exports = { saveDesign };
