const express = require("express");
const jwt = require("jsonwebtoken");

async function verifyusertoken(req, res, next) {
  const token = req.headers["token"];

  jwt.verify(
    token,
    global.config.secretkey,
    { algorithms: global.config.algorithms },
    (err, decode) => {
      if (err) {
        return err;
      } else {
        if (decode.role == "user") {
          req.decode = decode;
          console.log(decode);
          next();
        } else {
          return res.status(401).send("unauthorized access");
        }
      }
    }
  );
}

module.exports = { verifyusertoken };
