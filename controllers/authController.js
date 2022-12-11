const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const validator = require("../validations/userValidation");
const controller = {
  login: async (req, res) => {
    const validationResults = validator.login.validate(req.body);
    if (validationResults.error) {
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    const validatedResults = validationResults.value;
    let user = null;
    const errMsg = "Incorrect username or password";
    // console.log("validatedResults:", validatedResults);
    try {
      user = await UserModel.findOne({ username: validatedResults.username });
      if (!user) {
        return res.status(401).json({ error: errMsg });
      }
    } catch (err) {
      return res.status(500).json({ error: "failed to get user" });
    }

    const passwordMatches = await bcrypt.compare(
      validatedResults.password,
      user.hashed_password
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: errMsg });
    }

    res.send("done");
  },
};

module.exports = controller;
