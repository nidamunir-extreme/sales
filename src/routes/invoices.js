const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const invoiceController = require('../controllers/invoice');

router.post('/', authMiddleware, adminMiddleware, invoiceController.createInvoice);
router.get('/', authMiddleware, adminMiddleware, invoiceController.getInvoices);
router.get('/:id', authMiddleware, adminMiddleware, invoiceController.getInvoicesById);


module.exports = router;
