require("dotenv").config();
const mongoose = require("mongoose");
const user = require("../models/userModel.js");

const data = [
  {
    username: "sgClara",
    hash: 123,
  },
  {
    username: "sgHarold",
    hash: 123,
  },
];
const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.17sk9.mongodb.net/?retryWrites=true&w=majority`;
async function init() {
  await mongoose.connect(connStr, { dbName: process.env.DB_NAME });
  await user.insertMany(data);

  console.log("success!");

  process.exit();
}

init();
