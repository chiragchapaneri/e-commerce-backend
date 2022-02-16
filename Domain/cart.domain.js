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
const { number } = require("joi");

//user

async function addcart(req, res) {
  const productdata = await Product.findOne({
    _id: req.body.productid,
  }).and({
    active: true,
  });

  if (productdata === null) {
    return res.send({ message: "invalid id.." });
  } else {
    const user_product = await Cart.findOne({ userid: req.decode._id }).and({
      productid: req.body.productid,
    });

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
          return res.send({ message: "suuccessfull..", data: updatedda });
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

        res.send(data);
      } else {
        return res.status(400).send({
          message: `you can add max ${productdata.quantity} quantity`,
        });
      }
    }
  }
}

async function RemoveCart(req, res) {
  console.log("yexs");
  const user_productdata = await Cart.findOne({ userid: req.decode._id }).and({
    productid: req.body.productid,
  });

  if (user_productdata) {
    const remove = await Cart.findByIdAndRemove(user_productdata._id);
    if (remove) {
      res.status(200).send("product is remove");
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
        userid: req.decode._id,
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
        data.products[0].active == true &&
        data.quantity <= data.products[0].quantity
      ) {
        data.message = "avalible";
        subtotal += data.quantity * data.products[0].price;
        return data;
      } else if (data.products[0].quantity > 0) {
        data.err = `plese enter ${data.products[0].quantity} quantity`;
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
        userid: parseInt(req.params.id),
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
  ]);
  let subtotal = 0;
  if (data.length !== 0) {
    const showdata = data.map((data, index) => {
      if (
        data.quantity >= 1 &&
        data.products[0].active == true &&
        data.quantity <= data.products[0].quantity
      ) {
        data.message = "avalible";
        console.log(data.products[0]._id);
        console.log(data.quantity);
        subtotal += data.quantity * data.products[0].price;
        return data;
      } else if (data.products[0].quantity > 0) {
        data.err = `plese enter ${data.products[0].quantity} quantity`;
        console.log(index);
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

module.exports = {
  addcart,
  Decrease_Quantity,
  showcart,
  showcartbyuserid,
  RemoveCart,
};
