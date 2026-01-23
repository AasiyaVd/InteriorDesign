const express = require("express");
const prisma = require("../prisma");   // CommonJS import
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

    // one UserNeeds row per user (update if exists)
    const needs = await prisma.userNeeds.upsert({
      where: { userId: req.user.id },
      update: {
        city,
        budgetRange,
        spaceType,
        timeline
      },
      create: {
        userId: req.user.id,
        city,
        budgetRange,
        spaceType,
        timeline
      }
    });

    res.status(201).json({
      message: "User needs saved successfully",
      needs
    });

  } catch (error) {
    console.error("UserNeeds error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
