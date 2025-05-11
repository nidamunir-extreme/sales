const mongoose = require('mongoose');

module.exports = {
  async up(db, client) {
    // Fetch one user and a few products
    const user = await db.collection('users').findOne({});
    const products = await db.collection('products').find({}).limit(3).toArray();

    if (!user || products.length === 0) {
      throw new Error('❌ Cannot create invoices: missing users or products.');
    }

    const productIds = products.map(product => product._id);
    const total = products.reduce((sum, product) => sum + (product.price || 0), 0);

    const sampleInvoices = [
      {
        user: user._id,
        product: productIds,
        total,
        reference: 'INV-001',
        createdAt: new Date(),
      },
      {
        user: user._id,
        product: [productIds[0]],
        total: products[0].price,
        reference: 'INV-002',
        createdAt: new Date(),
      }
    ];

    // Delete all existing invoices before inserting new ones (optional)
    await db.collection('invoices').deleteMany({});

    await db.collection('invoices').insertMany(sampleInvoices);
    console.log('✅ Sample invoice data inserted.');
  },

  async down(db, client) {
    await db.collection('invoices').deleteMany({
      reference: { $in: ['INV-MIGRATE-001', 'INV-MIGRATE-002'] }
    });
    console.log('✅ Sample invoice data deleted during rollback.');
  }
};
