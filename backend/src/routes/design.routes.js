const express = require("express");
const fs = require("fs");
const path = require("path");
const prisma = require("../prisma");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router(); // ✅ REQUIRED

/**
 * POST /api/designs/save
 */
router.post("/save", authenticate, async (req, res) => {
  try {
const { image, title, beforeImage, designState } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    // 🔹 Extract base64 data
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // 🔹 Ensure folder exists
    const uploadDir = path.join(process.cwd(), "uploads", "designs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 🔹 Create filename
    const fileName = `design_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // 🔹 Save to DB
const design = await prisma.design.create({
  data: {
    title: title || "My Interior Design",
    imagePath: `/uploads/designs/${fileName}`, // AFTER
    beforeImage: beforeImage,                 // BEFORE
    designState: designState || {},           // FULL LAYOUT
    userId: req.user.id
  }
});


    res.status(201).json({
      message: "Design saved successfully",
      design
    });

  } catch (err) {
    console.error("Save design error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/designs
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const designs = await prisma.design.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(designs);
  } catch (err) {
    console.error("Fetch designs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router; // ✅ REQUIRED
