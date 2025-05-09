const Invoice = require('../models/invoice');
const User = require('../models/user');
const Product = require('../models/product');

exports.createInvoice = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return res.status(404).send('User or Product not found');
    const total = product.price * quantity;
    const invoice = new Invoice({ user: userId, product: productId, quantity, total });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('user', 'name email')
      .populate('product', 'name price');
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
