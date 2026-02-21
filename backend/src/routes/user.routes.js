const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.put("/update", userController.updateProfile);

module.exports = router;