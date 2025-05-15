const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.use(authMiddleware, adminMiddleware);

router.get("/daily", reportController.getDailySalesReport);

module.exports = router;
