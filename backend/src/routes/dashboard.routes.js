const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const prisma = require("../prisma");

router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    
    // ✅ Fetch user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        contact: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const designsCreated = await prisma.design.count({
      where: { userId }
    });

    const roomsDesigned = await prisma.aIDesign.count({
  where: { userId }
});

    res.json({
      user,
      stats:{
      designsCreated,
      roomsDesigned},
    });

  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
