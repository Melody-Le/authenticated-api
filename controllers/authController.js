const bcrypt = require("bcrypt");
const ipaddr = require("ipaddr.js");
const UserModel = require("../models/userModel");
const validator = require("../validations/userValidation");
const fetch = require("node-fetch");
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
  getCountryCode: async (req, res) => {
    // const ip = "192.168.0.188";

    let remoteAddress = req.ip;
    if (ipaddr.isValid(remoteAddress)) {
      const addr = ipaddr.parse(remoteAddress);
      console.log(addr.isIPv4MappedAddress());
      if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) {
        remoteAddress = addr.toIPv4Address().toString();
        console.log(remoteAddress);
      }
    }
    // const access_key = "883abb2024e3f13213aded435afe4994";
    // const url = `http://api.ipstack.com/${ip}?access_key=${access_key}`;

    // const fetch_res = await fetch(
    //   `http://ipinfo.io/${req.ip}?token=5fe0b07e8725b4`
    // )
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (payload) {
    //     // console.log(payload.location.country_code);
    //     console.log(payload);
    //   });
    // const fetch_data = await fetch_res.json();
    res.send("heehe");
  },
};

module.exports = controller;
