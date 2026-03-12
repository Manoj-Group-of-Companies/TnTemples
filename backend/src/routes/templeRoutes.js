const express = require("express");
const router = express.Router();

const templeController = require("../controllers/templeController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", templeController.getTemples);
router.get(
  "/admin-temples",
  protect,
  authorize("Admin"),
  templeController.getPendingTemples
);
router.get(
  "/my-temples",
  protect,
  authorize("Contributor", "Trusted Contributor", "Admin"),
  templeController.getMyTemples
);
router.get("/nearby", templeController.getNearbyTemples);
router.get("/:slug", templeController.getTempleBySlug);

// Contributor
router.post(
  "/",
  protect,
  authorize("Contributor", "Trusted Contributor", "Admin"),
  upload.array("images", 10), // max 5 images
  templeController.createTemple
);

// Admin
router.patch("/:id/approve", protect, authorize("Admin"), templeController.approveTemple);
router.patch("/:id/reject", protect, authorize("Admin"), templeController.rejectTemple);

module.exports = router;