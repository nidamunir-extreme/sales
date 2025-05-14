const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const Product = require("../models/product");

exports.createInvoice = async (req, res) => {
  try {
    const { user, productIds, reference, total } = req.body;

    if (
      !user ||
      !Array.isArray(productIds) ||
      productIds.length === 0 ||
      !reference ||
      total == null
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Validate all product IDs
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Some product IDs are invalid." });
    }

    // Create invoice
    const invoice = new Invoice({
      user,
      products: productIds,
      total,
      reference,
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
    const invoice = await Invoice.findById(id)
      .populate("user", "name email")
      .populate("product", "name price");

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Error retrieving invoice:", err);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
};
