const express = require("express");
const {
  uservalid,
  validproductserch,
  validproductname,
  validadress,
  vlidfeedback,
} = require("./validation");
const jwt = require("jsonwebtoken");

const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");
const Order = require("../model/order");
const Shiping = require("../model/shipingmodel");
const Feedback = require("../model/feedback");
const { User } = require("../model/usermodel");
const bcrypt = require("bcrypt");
const { uploadimage } = require("../middleware/imageupload");
const { Country } = require("../model/country");

async function signup(req, res) {
  try {
    // const valid = await uservalid(req.body);

    const uniqueemail = await User.findOne({ email: req.body.email }).select({
      email: 1,
    });
    const mobile = await User.findOne({ mno: req.body.mno }).select({ mno: 1 });
    if (uniqueemail || mobile) {
      if (uniqueemail && mobile) {
        return res.status(500).send({
          email: "This email is alredy used ",
          mno: "This mobile no is alredy used",
        });
      } else {
        if (uniqueemail) {
          return res.status(500).send({ email: " email is alredy used" });
        } else {
          return res.status(500).send({ mno: " mobile is alredy used" });
        }
      }
    }
    // if (valid.error) {
    //   return res.status(404).send({ message: valid.error.details[0].message });
    // } else {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const savedata = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mno: req.body.mno,

        flate_name: req.body.flate_name,
        nearby: req.body.nearby,

        city: req.body.city,
        state: req.body.state,
        email: req.body.email,
        password: hash,
        image: req.image1 && req.image1.url,
      });
      const useradd = savedata.save();
      res.send(savedata);
    } catch (err) {
      return res.status(404).send({ err: err.message });
    }
    // }
  } catch (err) {
    console.log(err.message);
  }
}

async function profile(req, res) {
  try {
    console.log(req.image1);
    const updateprofile = await User.findByIdAndUpdate(req.body.id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mno: req.body.mno,

      flate_name: req.body.flate_name,
      nearby: req.body.nearby,

      city: req.body.city,

      image: req.image1 && req.image1.url,
    });
    const useradd = updateprofile.save();
    res.send(updateprofile);

    console.log(useradd);
  } catch (err) {
    return res.status(404).send({ err: err.message });
  }
}

async function login(req, res) {
  const userdata = await User.findOne({
    email: req.body.email,
  });
  if (userdata) {
    try {
      const match = await bcrypt.compare(req.body.password, userdata.password);
      if (match) {
        const token = jwt.sign(userdata.toObject(), global.config.secretkey, {
          algorithm: global.config.algorithm,
          expiresIn: "5000m",
        });

        res.status(200).json({
          token: token,
          id: userdata._id,
        });
      } else {
        res.status(400).send("Invalid Email or Password");
      }
    } catch (er) {
      console.log(er);
    }
  } else {
    res.status(400).send({
      err: "Invalid Email or Password",
    });
  }
}

async function getuser(req, res) {
  const userdata = await User.findOne({
    _id: req.params.id,
  });
  if (userdata) {
    res.status(200).send(userdata);
  }
}

async function getstate(req, res) {
  console.log("yesssssss");
  const state = await Country.find();

  if (state) {
    return res.send({ state });
  }
}

async function setstate(req, res) {
  const savedata = new Country({ state: req.body.state, city: req.body.city });
  const adddata = savedata.save();
}

async function feedback(req, res) {
  const findproduct = await Product.findById(req.body.productid);

  if (findproduct) {
    const { error } = await vlidfeedback(req.body);
    if (error) {
      return res.send({
        message: error.details[0].message,
      });
    } else {
      const feedbackdata = new Feedback({
        productid: req.body.productid,
        message: req.body.message,
        userid: req.decode._id,
      });
      const savedata = await feedbackdata.save();
      if (savedata) {
        return res.status(200).send({ message: "successfull" });
      }
    }
  } else {
    return res.status(200).send({ message: "product not found" });
  }
}

async function shiping(req, res) {
  console.log(req.decode._id);
  const shipingdata = await Shiping.find({ userid: req.decode._id })
    .populate({
      path: "productid",
      model: "product",
      select: ["productname", "price"],
    })
    .select({ address: 1, price: 1, city: 1 });
  console.log(shipingdata);
  if (shipingdata.length != 0) {
    return res.status(200).send({ messege: "successfull", data: shipingdata });
  } else {
    return res.status(200).send({ messege: "unsuccessfull" });
  }
}

async function ordercart(req, res) {
  const cartdata = await Cart.find({ userid: req.decode._id }).select({
    _id: 0,
    __v: 0,
  });

  const newquantity = {};

  if (cartdata) {
    for (let index = 0; index < cartdata.length; index++) {
      const findquantity = await Product.findOne({
        _id: cartdata[index].productid,
      });

      if (findquantity) {
        newquantity.quantity = findquantity.quantity - cartdata[index].quantity;
        newquantity.productid = cartdata[index].productid;
        console.log(newquantity);
        console.log(findquantity);
      }
      console.log(cartdata);

      console.log(cartdata[0]);
      // console.log(cartdata[index]);
      try {
        for (let index = 0; index < cartdata.length; index++) {
          // const element = array[index];

          const order = new Order({
            productid: cartdata[index].productid,
            userid: cartdata[index].userid,
            quantity: cartdata[index].quantity,
            total: cartdata[index].total,
          });
          console.log("newquantity[index].productid");
          console.log(newquantity);

          // console.log(newquantity[index].productid);

          // console.log(newquantity[index].productid);
          const pa = await order.save();
          if (pa) {
            const update = await Product.findByIdAndUpdate(
              newquantity.productid,
              { quantity: newquantity.quantity }
            );
            if (update) {
              res.status(200).send({
                message: "order successfull",
              });
              console.log("done");
            }
            // }
          }
        }
      } catch (er) {
        console.log(er);
      }
    }
  }
}
module.exports = {
  signup,
  login,

  feedback,
  shiping,
  getstate,
  getuser,
  profile,
  setstate,
};
