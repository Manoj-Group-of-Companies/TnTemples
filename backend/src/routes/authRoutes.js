const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", authController.loginUser);
router.post("/register", protect, authorize("Admin"), authController.registerUser);
router.get("/me", protect, authController.getProfile);
router.post("/set-password", authController.setPassword);

module.exports = router;