const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, min: 3, required: true, unique: true },
    hash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
