const mongoose = require('mongoose');

module.exports = {
  async up(db, client) {
    // Fetch the first user and product from the database (adjust as needed for your case)
    const user = await db.collection('users').findOne({});
    const product = await db.collection('products').findOne({});

    // If no user or product exists, log an error and exit
    if (!user || !product) {
      console.log('❌ No user or product found in the database.');
      return;
    }

    // Sample data to insert based on the updated schema
    const sampleInvoices = [
      {
        user: user._id, // Using the ObjectId of the first user found
        product: [product._id], // Using the ObjectId of the first product found
        quantity: 2,
        total: 200.0,
        createdAt: new Date(),
        reference: 'INV-001'
      },
      {
        user: user._id, // Using the ObjectId of the first user found
        product: [product._id], // Using the ObjectId of the first product found
        quantity: 3,
        total: 300.0,
        createdAt: new Date(),
        reference: 'INV-002'
      },
      {
        user: user._id, // Using the ObjectId of the first user found
        product: [product._id], // Using the ObjectId of the first product found
        quantity: 1,
        total: 100.0,
        createdAt: new Date(),
        reference: 'INV-003'
      }
    ];

    // Delete all existing invoices before inserting new ones (optional)
    await db.collection('invoices').deleteMany({});

    // Insert sample invoices
    await db.collection('invoices').insertMany(sampleInvoices);
    console.log('✅ Sample invoice data inserted.');
  },

  async down(db, client) {
    // Delete all invoices in case we need to roll back
    await db.collection('invoices').deleteMany({});
    console.log('✅ All invoice data deleted during rollback.');
  }
};
