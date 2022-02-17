const express = require("express");
const jwt = require("jsonwebtoken");
const cloudinary = require("../Domain/cloudinary");

async function verifyadmintoken(req, res, next) {
  const token = req.headers["token"];

  console.log("token");
  jwt.verify(
    token,
    global.config.secretkey,
    { algorithms: global.config.algorithms },

    (err, decode) => {
      if (decode.role == "admin") {
        req.decode = decode;
        next();
      } else {
        return res.status(401).send({ messege: "unauthorized access" });
      }
    }
  );
}

module.exports = { verifyadmintoken };
