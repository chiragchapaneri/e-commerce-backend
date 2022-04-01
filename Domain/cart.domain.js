const express = require("express");
const mongoose = require("mongoose");

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
const { number } = require("joi");
const { json } = require("body-parser");

async function addcart(req, res) {
  const productdata = await Product.findOne({
    _id: req.body.productid,
  });
  if (productdata === null) {
    return res.send({ message: "invalid id.." });
  } else {
    const user_product = await Cart.findOne({
      $and: [
        { userid: req.decode._id },
        { productid: mongoose.Types.ObjectId(req.body.productid) },
      ],
    });
    console.log(`data${user_product}`);

    if (user_product) {
      if (req.body.quantity + user_product.quantity <= productdata.quantity) {
        user_product.quantity = user_product.quantity + req.body.quantity;
        const price = await Product.findById(req.body.productid).select({
          price: 1,
        });
        user_product.total = price.price * user_product.quantity;

        const update = await Cart.findByIdAndUpdate(user_product._id, {
          total: user_product.total,
          quantity: user_product.quantity,
        });
        if (update) {
          const updatedda = await Cart.findById(user_product._id);

          const cartlength = await Cart.find({ userid: req.decode._id });
          return res.send({
            message: "suuccessfull..",
            data: updatedda,
            cartlength: cartlength.length,
          });
        }
      } else {
        return res.send({
          message: `you can have max 5`,
        });
      }
    } else {
      if (req.body.quantity <= productdata.quantity) {
        req.body.userid = req.decode._id;

        const total = req.body.quantity * productdata.price;

        req.body.total = total;
        const addcart = new Cart(req.body);
        const data = await addcart.save();
        const cartlength = await Cart.find({ userid: req.decode._id });

        res.send({ data: data, cartlength: cartlength.length });
      } else {
        return res.status(400).send({
          message: `you can add max ${productdata.quantity} quantity`,
        });
      }
    }
  }
}

async function RemoveCart(req, res) {
  const user_productdata = await Cart.findOne({ userid: req.decode._id }).and({
    productid: req.body.productid,
  });

  if (user_productdata) {
    const remove = await Cart.findByIdAndRemove(user_productdata._id);
    const cartlength = await Cart.find({ userid: req.decode._id });
    if (remove) {
      res
        .status(200)
        .send({ message: "product is remove", cartlength: cartlength.length });
    }
  }
}

async function Decrease_Quantity(req, res) {
  const user_productdata = await Cart.findOne({ userid: req.decode._id })
    .and({
      productid: req.body.productid,
    })
    .populate({
      path: "productid",
      model: "product",
      select: ["quantity", "price"],
    });

  if (user_productdata == null) {
    return res.status(400).send({
      message: "product not in cart",
    });
  }
  if (user_productdata) {
    if (user_productdata.quantity >= req.body.quantity) {
      user_productdata.quantity = user_productdata.quantity - req.body.quantity;
      const { price } = await Product.findById(req.body.productid).select({
        price: 1,
      });
      user_productdata.total =
        user_productdata.productid.price * user_productdata.quantity;
      if (user_productdata.quantity == 0) {
        const deletecart = await Cart.findByIdAndRemove(user_productdata._id);
        return res.status(200).send({ message: "ok", data: deletecart });
      } else {
        const update = await Cart.findByIdAndUpdate(user_productdata._id, {
          total: user_productdata.total,
          quantity: user_productdata.quantity,
        });
        return res.send({ message: "ok", data: update });
      }
    }
  }
}
async function showcart(req, res) {
  const data = await Cart.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productid",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $match: {
        userid: mongoose.Types.ObjectId(req.decode._id),
      },
    },

    {
      $project: {
        "products.productname": true,
        "products.price": true,
        "products.quantity": true,
        "products.active": true,
        "products._id": true,

        quantity: true,
      },
    },
  ]);
  let subtotal = 0;
  if (data.length != 0) {
    const showdata = data.map((data, index) => {
      if (
        data.quantity >= 1 &&
        data.products.active == true &&
        data.quantity <= data.products.quantity
      ) {
        data.message = "avalible";
        subtotal += data.quantity * data.products.price;
        return data;
      } else if (data.products.quantity > 0) {
        data.err = `plese enter ${data.products.quantity} quantity`;
        return data;
      } else {
        data.err = `out of stock`;

        return data;
      }
    });

    res.status(200).send({
      messege: "successfull",
      data: showdata,
      subtotal: subtotal,
    });
  } else {
    res.status(400).send({ messege: "cart is empty" });
  }
}

async function showcartbyuserid(req, res) {
  const id = req.params.id;

  // try {
  const data = await Cart.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productid",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $match: {
        userid: mongoose.Types.ObjectId(req.params.id),
      },
    },

    {
      $project: {
        "products.productname": true,
        "products.price": true,
        "products.quantity": true,
        "products.active": true,
        "products._id": true,
        "products.image1": true,
        "products.image2": true,
        userid: true,
        total: true,
        quantity: true,
      },
    },

    {
      $sort: {
        quantity: -1,
      },
    },

    {
      $unwind: "$products",
    },
  ]);
  // } catch (er) {
  //
  // }

  //

  // const news = await Cart.find({ userid: req.params.id }).populate(
  //   "productid",
  //   { price: -1 }
  // );
  // console.log(news);znm

  const datass = await Cart.find({
    userid: mongoose.Types.ObjectId(req.decode._id),
  }).populate({
    path: "productid",
    options: { sort: { price: -1 } },
  });
  // .sort({ price: -1 });

  datass.map((data) => {
    console.log(data.productid.price);
  });

  let subtotal = 0;
  if (data.length !== 0) {
    const showdata = data.map((data, index) => {
      if (
        data.quantity >= 1 &&
        data.products.active == true &&
        data.quantity <= data.products.quantity
      ) {
        data.message = "avalible";

        subtotal += data.quantity * data.products.price;
        return data;
      } else if (data.products.quantity > 0 && data.products.active == true) {
        data.err = `plese enter ${data.products.quantity} quantity`;

        return data;
      } else {
        data.err = `out of stock`;
        return data;
      }
    });

    res.send({
      messege: "successfull",
      data: showdata,
      subtotal: subtotal,
    });
  } else {
    res.send({ messege: "cart is empty" });
  }
}

async function uorderlist(req, res) {
  const url = require("url");
  console.log(req.query);

  // var q = url.parse(req.url, true);
  // console.log(req.query.page);

  // const datalength = await Order.aggregate;
  const data = await Order.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productid",
        foreignField: "_id",
        as: "productid",
      },
    },
    {
      $match: {
        userid: mongoose.Types.ObjectId(req.decode._id),
      },
    },

    {
      $project: {
        "productid.productname": true,
        "productid.price": true,

        "productid.image1": true,
        price: 1,
        quantity: 1,
        city: 1,
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      },
    },

    {
      $unwind: "$productid",
    },
  ]);
  const pages = Math.ceil(data.length / 10);
  // console.log(pages);
  const apidata = data.splice((req.query.page - 1) * 10, 10);
  if (data != 0) {
    res.send({
      length: pages,
      message: "order list",
      data: apidata,
      datalength: data.length,
    });
  } else {
    res.send({
      message: "data not found",
    });
  }
}

module.exports = {
  addcart,
  Decrease_Quantity,
  showcart,
  showcartbyuserid,
  RemoveCart,
  uorderlist,
};
