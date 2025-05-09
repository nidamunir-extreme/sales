const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    const products = [
      { _id: new ObjectId(), name: 'Product A', price: 100 },
      { _id: new ObjectId(), name: 'Product B', price: 150 },
      { _id: new ObjectId(), name: 'Product C', price: 200 },
    ];

    await db.collection('products').insertMany(products);
  },

  async down(db) {
    await db.collection('products').deleteMany({
      name: { $in: ['Product A', 'Product B', 'Product C'] },
    });
  }
};
