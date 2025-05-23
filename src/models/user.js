const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
