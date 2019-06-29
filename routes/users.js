const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/variables");
const cryptor = require("../utils/cryptor");

const validateData = elements => {
  validation = true;
  elements.forEach(element => {
    if (element == undefined || element == null || element == "")
      validation = false;
  });
  return validation;
};

router.post("/", (req, res) => {
  const data = req.body;
  if (!validateData([data.name, data.email, data.password]))
    res.status(400).json({ success: false, msg: "insuffecient information" });
  else {
    User.addUser(data)
      .then(() =>
        res.json({ success: true, msg: "User has been added successfully" })
      )
      .catch(err => {
        res.status(500).json({ success: false, msg: err });
      });
  }
});

router.post("/authenticate", (req, res) => {
  const data = req.body;
  console.log(data);
  if (!validateData([data.email, data.password]))
    res.status(400).json({ success: false, msg: "insuffecient information" });
  else {
    User.authenticate(data.email, data.password)
      .then(user => {
        user.password = "----";
        const token = jwt.sign({ data: cryptor.crypt(user) }, config.secret, {
          expiresIn: 12000
        });
        res.json({ success: true, msg: "JWT " + token });
      })
      .catch(err => {
        res.status(500).json({ success: false, msg: err });
      });
  }
});

module.exports = router;
