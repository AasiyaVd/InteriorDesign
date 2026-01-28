const express = require("express");
const prisma = require("../prisma"); // adjust path if needed

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    res.status(201).json({ message: "Subscribed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;