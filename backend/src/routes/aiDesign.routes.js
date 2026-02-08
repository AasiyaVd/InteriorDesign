const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* ================= SAVE AI DESIGN ================= */
router.post("/save", async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      style,
      roomType,
      colorMood,
      lighting,
      beforeImage,
      afterImage
    } = req.body;

    if (!style || !roomType || !beforeImage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const savedDesign = await prisma.aIDesign.create({
      data: {
        userId,
        style,
        roomType,
        colorMood,
        lighting,
        beforeImage,
        afterImage
      }
    });

    res.json({
      message: "Design saved successfully",
      design: savedDesign
    });

  } catch (err) {
    console.error("SAVE AI DESIGN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
