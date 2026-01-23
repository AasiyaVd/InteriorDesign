const express = require("express");
const prisma = require("../prisma"); // use YOUR prisma.js

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      category,
      occupation,
      firstName,
      lastName,
      email,
      company,
      phone,
      referral,
      country,
      message
    } = req.body;

    if (
      !category ||
      !occupation ||
      !firstName ||
      !lastName ||
      !email ||
      !referral ||
      !country
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    await prisma.contactMessage.create({
      data: {
        category,
        occupation,
        firstName,
        lastName,
        email,
        company,
        phone,
        referral,
        country,
        message
      }
    });

    return res.status(201).json({
      message: "Message sent successfully"
    });

  } catch (err) {
    console.error("CONTACT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
