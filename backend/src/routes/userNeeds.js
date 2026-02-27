const express = require("express");
const prisma = require("../prisma");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /api/user-needs
 */
router.post("/", authenticate, async (req, res) => {
  try {

    const {
      city,
      budgetRange,
      style,
      property,
      room,
      timeline,
      contact
    } = req.body;

    // ✅ Proper validation
    if (!city || !budgetRange || !style || !property || !room || !timeline || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find latest design
    const latestDesign = await prisma.design.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    if (!latestDesign) {
      return res.status(400).json({ message: "No design found for this user" });
    }

    // ✅ Create request
    const request = await prisma.designRequest.create({
      data: {
        userId: req.user.id,
        designId: latestDesign.id,   // 🔥 THIS was missing
        city,
        budgetRange,
        designStyle: style,
        propertyType: property,
        roomType: room,
        projectTimeline: timeline,
        preferredContactMethod: contact
      }
    });

    res.status(201).json({
      message: "Design request saved successfully ✅",
      request
    });

  } catch (error) {
    console.error("DesignRequest error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
