const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const roleController = require("../controllers/role");

router.use(authMiddleware);

router.get("/", roleController.getAllRoles);
router.post("/", roleController.createRole);
router.get("/:id", roleController.getRoleById);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

module.exports = router;
