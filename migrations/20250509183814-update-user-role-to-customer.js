const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    const roleId = new ObjectId('681e4873df21283525ad4a9f');
    const result = await db.collection('roles').updateOne(
      { _id: roleId },
      { $set: { name: 'customer' } }
    );
    console.log(result);
  },

  async down(db) {
    const roleId = new ObjectId('681e4873df21283525ad4a9f');
    const result = await db.collection('roles').updateOne(
      { _id: roleId },
      { $set: { name: 'user' } }
    );
    console.log(result);
  }
};
