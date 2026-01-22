const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { saveDesign } = require("../controllers/design.controller");
const prisma = require("../prisma"); // ✅ ADD THIS LINE

router.post("/save", upload.single("image"), saveDesign);

// GET all designs (latest first)
router.get("/", async (req, res) => {
  try {
    const designs = await prisma.design.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(designs);
  } catch (err) {
    console.error("❌ FETCH DESIGNS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch designs" });
  }
});

module.exports = router;
