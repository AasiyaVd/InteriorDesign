const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authenticate = require("../middleware/auth.middleware");

const prisma = new PrismaClient();

/* ================= SAVE AI DESIGN ================= */
router.post("/save", authenticate, async (req, res) => {
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

    res.json({ message: "Design saved successfully", design: savedDesign });

  } catch (err) {
    console.error("SAVE AI DESIGN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET USER AI DESIGNS ================= */
router.get("/", authenticate, async (req, res) => {
  try {
    const designs = await prisma.aIDesign.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(designs);
  } catch (err) {
    console.error("GET AI DESIGNS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
