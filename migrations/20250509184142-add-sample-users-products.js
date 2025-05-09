const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    // Fetch existing roles
    const roles = await db.collection('roles').find({}).toArray();
    const roleIds = roles.map(role => role._id);

    // Fetch existing products
    const products = await db.collection('products').find({}).toArray();
    const productIds = products.map(product => product._id);

    // Sample users
    const users = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: roleIds[0], // Assigning the first role
        favoriteProducts: [productIds[0], productIds[1]] // Assigning first two products
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: roleIds[1], // Assigning the second role
        favoriteProducts: [productIds[1], productIds[2]] // Assigning second and third products
      }
    ];

    // Insert users into the 'users' collection
    await db.collection('users').insertMany(users);
  },

  async down(db) {
    // Remove all users created in this migration
    await db.collection('users').deleteMany({
      email: { $in: ['alice@example.com', 'bob@example.com'] }
    });
  }
};
