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
      user.hash
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: errMsg });
    }
    req.session.regenerate(function (err) {
      if (err) {
        return res
          .status(401)
          .json({ error: `Authentication failed. Please try again!` });
      }

      req.session.user = user.username;

      req.session.save(function (err) {
        if (err) {
          return res
            .status(401)
            .json({ error: `Authentication failed. Please try again!` });
        }
        res.status(200).json({ message: "Success Login", user });
      });
    });
  },
};

module.exports = controller;
