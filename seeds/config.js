require("dotenv").config();
const mongoose = require("mongoose");
const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.17sk9.mongodb.net/?retryWrites=true&w=majority`;
const connectDb = async () => {
  try {
    await mongoose.connect(connStr, { dbName: process.env.DB_NAME });
    console.log("Connected to DB");
  } catch (err) {
    console.log(`Failed to connect to DB: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDb();
