const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
// const authRouter = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 8800;

const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.17sk9.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
  })
);

app.use(cors({ origin: "*" }));

app.use("/api/v1/auth", authRouter);

app.listen(port, async () => {
  try {
    await mongoose.connect(connStr, {
      dbName: "authenticated-api",
    });
  } catch (error) {
    console.log(`====>Failed to connect to DB<==== Error: ${error}`);
    process.exit(1);
  }
  console.log(`====>Connected to MongoDB`);
  console.log(`====>Authenticated-api app listening on port ${port}<====`);
});
