const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.use(authMiddleware, adminMiddleware);

// e.g. GET /reports/daily?date=2025-05-13
router.get("/daily", reportController.getDailySalesReport);
router.get(
  "/daily/pdf",
  authMiddleware,
  adminMiddleware,
  reportController.downloadDailySalesReportPdf
);

module.exports = router;
