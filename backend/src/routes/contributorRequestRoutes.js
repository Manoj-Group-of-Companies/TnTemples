const express = require("express");
const router = express.Router();

const controller = require("../controllers/contributorRequestController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", controller.createRequest);

router.get(
  "/",
  protect,
  authorize("Admin"),
  controller.getRequests
);

router.patch(
  "/:id/approve",
  protect,
  authorize("Admin"),
  controller.approveRequest
);

module.exports = router;