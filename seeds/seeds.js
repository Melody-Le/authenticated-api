require("./config");

const userSeed = require("./users");
const UsersJson = require("./users.json");

const seed = async () => {
  await userSeed(UsersJson);
  process.exit(1);
};

seed();
