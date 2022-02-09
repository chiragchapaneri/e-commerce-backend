const express = require("express");
const req = require("express/lib/request");
const route = express.Router();
const { Admin } = require("../model/adminmodel");
const { adminvalid } = require("./validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//admin signup
async function adminsignup(req, res) {
  const valid = await adminvalid(req.body); //validation
  console.log(req.body.password);
  if (valid.error) {
    return res.status(404).send({ message: valid.error.details[0].message });
  } else {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const addadmin = new Admin({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mno: req.body.mno,
        email: req.body.email,
        password: hash,
      });
      const savedata = await addadmin.save();

      return res.status(200).send({ messege: "successfull" });
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(400)
          .send({ message: "enter younique value", data: err.keyValue });
      } else {
        return res.status(404).send({ err: err });
      }
    }
  }
}

async function adminlogin(req, res) {
  try {
    const userdata = await Admin.findOne({
      email: req.body.email,
    });
    if (userdata) {
      const match = await bcrypt.compare(req.body.password, userdata.password);

      if (match) {
        const token = jwt.sign(userdata.toJSON(), global.config.secretkey, {
          algorithm: global.config.algorithm,
          expiresIn: global.config.expiresIn,
        });
        res.status(200).send(token);
      } else {
        res.status(400).send("login unsuccessfull..");
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
}
module.exports = {
  adminsignup,
  adminlogin,
};
