module.exports = {
  async up(db) {
    // Create collections
    await db.createCollection("roles");
    await db.createCollection("users");
    await db.createCollection("products");
    await db.createCollection("invoices");

    // Insert data to trigger database creation
    await db.collection("roles").insertMany([
      { name: "admin" },
      { name: "user" }
    ]);
    await db.collection("users").insertOne({ email: "test@example.com", name: "Test User" });

    // Optional: Add more data to ensure the collections are created
  },

  async down(db) {
    await db.collection("invoices").drop();
    await db.collection("products").drop();
    await db.collection("users").drop();
    await db.collection("roles").drop();
  }
};
