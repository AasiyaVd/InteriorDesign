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

router.put("/:id", authenticate, async (req, res) => {  try {
    const userId = Number(req.user.id);
    const designId = Number(req.params.id);

    const { title, image, beforeImage, designState } = req.body;

    const design = await prisma.design.update({
      where: {
        id: designId
      },
      data: {
        title: title || "Untitled Design",
        imagePath: image,
        beforeImage: beforeImage,
        designState: designState
      }
    });

    res.json({
      message: "Design updated successfully",
      design
    });

  } catch (err) {
    console.error("Update design error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {

    const designId = Number(req.params.id);
    const userId = req.user.id;

    const design = await prisma.design.findUnique({
      where: { id: designId }
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (design.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this design" });
    }

    /* 🔥 STEP 1: delete related Make-It-Real requests */
    await prisma.designRequest.deleteMany({
      where: { designId: designId }
    });

    /* 🔥 STEP 2: delete the design itself */
    await prisma.design.delete({
      where: { id: designId }
    });

    res.json({ message: "Design deleted successfully" });

  } catch (err) {
    console.error("Delete design error:", err);
    res.status(500).json({ message: "Server error deleting design" });
  }
});
module.exports = router; // ✅ REQUIRED
