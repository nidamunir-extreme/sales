const Invoice = require("../models/invoice");
const User = require("../models/user");
const Product = require("../models/product");

exports.createInvoice = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product)
      return res.status(404).send("User or Product not found");
    const total = product.price * quantity;
    const invoice = new Invoice({
      user: userId,
      product: productId,
      quantity,
      total,
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};

    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    }

    const invoices = await Invoice.find(filter)
      .populate("user", "name email")
      .populate("product", "name price")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ error: "Failed to retrieve invoices" });
  }
};

exports.getInvoicesById = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid invoice ID format" });
  }

  try {
    const invoices = await Invoice.find()
      .populate("user", "name email")
      .populate("product", "name price");
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error retrieving invoice:", err);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
};
