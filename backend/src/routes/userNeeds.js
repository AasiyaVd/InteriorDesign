const express = require("express");
const prisma = require("../prisma");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /api/user-needs
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { city, budgetRange, spaceType, timeline } = req.body;

    if (!city || !budgetRange || !spaceType || !timeline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find latest design of user
    const latestDesign = await prisma.design.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestDesign) {
      return res.status(400).json({ message: "No design found for this user" });
    }

    // ✅ Save into DesignRequest table (NOT userNeeds)
    const request = await prisma.designRequest.create({
      data: {
        userId: req.user.id,
        designId: latestDesign.id,
        city,
        budgetRange,
        spaceType,
        timeline,
        designerName: "Not Assigned",
      },
    });

    res.status(201).json({
      message: "Design request saved successfully ✅",
      request,
    });

  } catch (error) {
    console.error("DesignRequest error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
