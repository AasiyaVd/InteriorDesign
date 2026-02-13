const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");
const prisma = require("../prisma");

router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const designsCreated = await prisma.design.count({
      where: { userId }
    });

    const roomsDesigned = await prisma.aIDesign.count({
  where: { userId }
});

    res.json({
      designsCreated,
      roomsDesigned
    });

  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
