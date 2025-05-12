const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const productController = require("../controllers/product");

router.use(authMiddleware);

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
