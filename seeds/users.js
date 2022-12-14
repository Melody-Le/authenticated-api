const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");

const createUsers = async (users) => {
  for await (const user of users) {
    const pw = user.hash;
    const hash = await bcrypt.hash(pw, 10);
    user.hash = hash;
    try {
      await UserModel.create(user);
    } catch (err) {
      console.log(`err creating user: ${err}`);
    }
  }
};

module.exports = createUsers;
