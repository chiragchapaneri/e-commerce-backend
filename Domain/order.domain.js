const express = require("express");
const req = require("express/lib/request");
const route = express.Router();
const { Admin } = require("../model/adminmodel");
const {
  adminvalid,
  categoryvalid,
  valid_updatecategory,
  update_productvalid,
} = require("./validation");
const jwt = require("jsonwebtoken");
const Product = require("../model/productmodel");
const { productvalid } = require("./validation");
const { Category } = require("../model/categorymodel");
const Cart = require("../model/cartmodel");
const Order = require("../model/order");
const Shiping = require("../model/shipingmodel");
const {
  uservalid,
  validproductserch,
  validproductname,
  validadress,
  vlidfeedback,
} = require("./validation");

//admin watch the order list

async function uorderlist(req, res) {
  console.log(req.decode._id);

  const data = await Order.find()
    .populate({
      path: "productid",
      model: "product",
      select: ["productname", "price"],
    })

    .select({
      quantity: 1,
      _id: 1,
      userid: 1,
    })
    .populate({
      path: "userid",
      model: "user",
      select: ["firstname"],
    })
    .select({
      _id: 1,
    });
  if (data != 0) {
    res.status(200).send({
      message: "order list",
      data: data,
    });
  } else {
    res.send({
      message: "data not found",
    });
  }
}
//user
//one

async function order(req, res) {
  const findproduct = await Product.findById(req.body.productid);
  if (findproduct == null) {
    return res.send({ message: "product is not found" });
  }

  if (findproduct.quantity < req.body.quantity) {
    return res.json({
      messege: `you can order minimum ${findproduct.quantity}`,
    });
  } else {
    const total = findproduct.price * req.body.quantity;
    const lastquantity = findproduct.quantity - req.body.quantity;
    console.log(req.decode);
    const orderdata = new Order({
      quantity: req.body.quantity,
      userid: req.decode._id,
      productid: req.body.productid,
      price: findproduct.price,
      date: new Date(),
      toal: total,
    });
    const savedata = await orderdata.save();
    if (req.body.address) {
      const shiping = new Shiping({
        userid: req.decode._id,
        productid: req.body.productid,
        quantity: req.body.quantity,
        address: req.body.address,
      });
      const save_shipingdata = await shiping.save();
    } else {
      const shiping = new Shiping({
        userid: req.decode._id,
        productid: req.body.productid,
        quantity: req.body.quantity,
        address: req.decode.address,
        city: req.decode.city,
      });
      const save_shipingdata = await shiping.save();
    }
    if (savedata) {
      updatedata = await Product.findByIdAndUpdate(req.body.productid, {
        quantity: lastquantity,
      });
      res.send({
        message: "order successfull...",
        updatedata: orderdata,
      });
    }
  }
}

async function orderlist(req, res) {
  console.log(req.decode._id);

  const data = await Order.find({ userid: req.decode._id })
    .populate({
      path: "productid",
      model: "product",
      select: ["productname", "price"],
    })
    .select({ productname: 1, price: 1, quantity: 1, _id: 1, date: 1 });
  if (data != 0) {
    res.send({
      message: "order list",
      data: data,
    });
  } else {
    res.send({
      message: "data not found",
    });
  }
}

async function newcartorders(req, res) {
  // console.log(req.body);
  if (req.bodyy) {
    const { error } = await validadress(req.body);
    if (error) {
      return res.status(400).send({ err: error.details[0].message });
    }
  }

  if (!req.body.length) {
    const order = new Order({
      productid: req.body.productid,
      userid: req.body.userid,
      quantity: req.body.quantity,
      total: req.body.total,
      addressline1: req.body.addressline1
        ? req.body.addressline1
        : req.decode.flate_name,
      addressline2: req.body.addressline2
        ? req.body.addressline2
        : req.decode.nearby,
      city: req.body.city ? req.body.city : req.decode.city,
      state: req.body.state ? req.body.state : req.decode.state,
    });
    const savedata = await order.save();

    if (savedata) {
      const productdetails = await Product.updateOne(
        {
          _id: req.body.productid,
        },
        { $inc: { quantity: -req.body.quantity } }
      );
      return res.status(200).send({ message: "order successfull" });
    }
  } else {
    console.log("Aascsc");
  }

  try {
    req.body.map(async (data) => {
      const order = new Order({
        productid: data.productid,
        userid: data.userid,
        quantity: data.quantity,
        total: data.total,
        addressline1: data.addressline1
          ? data.addressline1
          : req.decode.flate_name,
        addressline2: data.addressline2 ? data.addressline2 : req.decode.nearby,
        city: data.city ? data.city : req.decode.city,
        state: data.state ? data.state : req.decode.state,
      });
      const savedata = await order.save();

      if (savedata) {
        const productdetails = await Product.updateOne(
          {
            _id: data.productid,
          },
          { $inc: { quantity: -req.body[0].quantity } }
        );
        const cartdetails = await Cart.findByIdAndRemove(data._id);
        // const cartdetails = await Cart.findByIdAndRemove(req.body[0]._id);
      }
    });

    return res.status(200).send({
      message: "order successfull",
    });
  } catch (er) {
    console.log(er);
  }
}

// const user_cartdata = await Cart.find({ userid: req.decode._id });
// if (user_cartdata.length == 0) {
//   return res.send({
//     message: "cart is empty",
//   });
// }

// const productdata = await Product.find();
// let orderdata = user_cartdata.filter((data) => {
//   let product = productdata.filter((productfiltter) => {
//     return (
//       productfiltter._id == data.productid &&
//       productfiltter.quantity > data.quantity
//     );
//   });

//   if (product.length != 0) {
//     product = undefined;
//     return true;
//   }
// });
// if (orderdata != 0) {
//   orderdata.forEach(async (data) => {

//     const order = new Order({
//       productid: data.productid,
//       userid: req.decode._id,
//       quantity: data.quantity,
//       total: data.total,
//       addressline1: req.body.addressline1?req.body.addressline1:req.decode.flate_name,
//       addressline2: req.body.addressline2?req.body.addressline2:req.decode.nearby,
//       city: req.body.city?req.body.city:req.decode.city,
//       state: req.body.state?req.body.state:req.decode.state,
//     });
//     const savedata = await order.save();

//     const { quantity } = await Product.findById(data.productid).select({
//       quantity: true,
//     });
//     let quantitys = quantity - data.quantity;

//     const update = await Product.updateOne(
//       { _id: data.productid },
//       { $set: { quantity: quantitys } }
//     );
//     updatecart = await Cart.findByIdAndDelete(data._id).and({
//       userid: req.decode._id,
//     });
//     if (req.body.address) {
//       const shiping = new Shiping({
//         userid: req.decode._id,
//         productid: data.productid,
//         quantity: data.quantity,
//         addressline1: req.body.addressline1,
//         addressline2: req.body.addressline2,
//         city: req.body.city,
//         state: req.body.state,
//       });
//       const save_shipingdata = await shiping.save();
//     } else {
//       const shiping = new Shiping({
//         userid: req.decode._id,
//         productid: data.productid,
//         quantity: data.quantity,

//         addressline1: req.decode.flate_name,
//         addressline2: req.decode.nearby,

//         city: req.decode.city,
//         state: req.decode.state,
//       });
//       const save_shipingdata = await shiping.save();
//     }
//   });
// }
// if (orderdata.length != 0) {
//   res.status(200).send({ messege: "order successfull..", data: orderdata });
// } else {
//   res.status(404).send({ messege: "unsuccessfull" });
// }
// }

module.exports = { orderlist, order, newcartorders, uorderlist };
