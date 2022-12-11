const bcrypt = require("bcrypt");
const ipaddr = require("ipaddr.js");
const { lookup } = require("geoip-lite");
const UserModel = require("../models/userModel");
const validator = require("../validations/userValidation");
const fetch = require("node-fetch");
const controller = {
  login: async (req, res) => {
    const errMsg = "Incorrect username or password";
    const username = req.body.username;
    const usernameFirst2 = username.slice(0, 2);
    const url = `http://ip-api.com/json`;
    const countryCode = await fetch(url)
      .then((response) => response.json())
      .then((payload) => payload.countryCode)
      .catch((err) =>
        res.status(401).json({ error: "can not detect user location" })
      );
    if (usernameFirst2 !== countryCode) {
      return res.status(400).json({
        error: errMsg,
      });
    }
    const validationResults = validator.login.validate(req.body);
    if (validationResults.error) {
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    const validatedResults = validationResults.value;
    let user = null;
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
  // getCountryCode: async (req, res) => {
  //   const url = `http://ip-api.com/json`;
  //   const fetchLocation = await fetch(url)
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (payload) {
  //       // console.log(payload.location.country_code);
  //       // console.log(payload.countryCode);
  //       // console.log(payload);
  //       return payload.getCountryCode;
  //     });
  //   // const data = await fetch(url);
  //   // res.send("haha");
  // },
};

module.exports = controller;
