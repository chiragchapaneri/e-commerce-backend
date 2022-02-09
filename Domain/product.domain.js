const express = require("express");
const req = require("express/lib/request");
const route = express.Router();
const { update_productvalid } = require("./validation");
const jwt = require("jsonwebtoken");
const Product = require("../model/productmodel");
const { productvalid } = require("./validation");
const cloudinary = require("./cloudinary");

const {
  uservalid,
  validproductserch,
  validproductname,
  validadress,
  vlidfeedback,
} = require("./validation");
const { uploadimages } = require("../middleware/imageupload");
//Admin
async function productbyid(req, res) {
  console.log(req.params);
  const addproduct = await Product.findOne({ _id: req.params.id });

  //find product by id
  if (addproduct != null) {
    res.send(addproduct);
  } else {
    res.send({ messege: "data not found" });
  }
}
//show all product
async function allproduct(req, res) {
  const addproduct = await Product.find();

  if (addproduct.length != 0) {
    res.send({ data: addproduct });
  } else {
    res.send({ messege: "data not founf" });
  }
}

//find one product
async function findone(req, res) {
  const productdata = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        "category.active": true,
        price: { $gt: 200 },
        _id: req.params.id,
      },
    },
    {
      $project: {
        "category.categoryname": true,
        productname: 1,
      },
    },
  ]).select();
  if (productdata != 0) res.send(productdata);
  else {
    res.send("done");
  }
  console.log(productdata);
}

//update product
async function updateproduct(req, res) {
  const data = await update_productvalid(req.body);
  if (data.error) {
    return res.send({ message: data.error.details[0].message });
  } else {
    const find = await Product.findById(req.body.productid);
    if (!find) {
      return res.send({ message: "id not found" });
    } else {
      const file = req.files ? req.files.img.tempFilePath : "";
      file.length > 0 &&
        file.map((data) => {
          console.log(data);
        });
      const result = file ? await cloudinary.uploader.upload(file) : "";
      console.log(find);
      const updateproduct = await Product.findByIdAndUpdate(
        req.body.productid,
        {
          productname: req.body.productname,
          price: req.body.price,
          quantity: req.body.quantity ? req.body.quantity : find.quantity,
          details: req.body.details ? req.body.details : find.details,
          active: req.body.active ? req.body.active : find.active,
          image1: req.image1 ? req.image1.url : find.image1,
          image2: req.image2 ? req.image2.url : find.image2,
          image3: req.image3 ? req.image3.url : find.image3,
          image4: req.image4 ? req.image4.url : find.image4,
          image5: req.image5 ? req.image5.url : find.image5,
          date: new Date(),
        }
      );

      console.log(updateproduct);
      const data = await Product.findById(req.body.productid);
      console.log(data);
      if (updateproduct) {
        res.json({
          message: "upadet successfull",
          data: data,
        });
      }
      // if (!updateproduct) {
      //   return res.send({
      //     message: "id not found",
      //   });
      // }
    }
  }
}
async function productadd(req, res) {
  const valid = await productvalid(req.body);

  try {
    const images = await uploadimages(req.files);
    console.log(req.files);

    if (valid.error) {
      return res.send({ err: valid.error.details[0] });
    } else {
      const savedata = new Product({
        category: req.body.category,
        productname: req.body.productname,

        price: req.body.price,
        quantity: req.body.quantity,
        ram: req.body.ram,
        processor: req.body.processor,
        size: req.body.size,
        color: req.body.color,
        storage: req.body.storage,
        other: req.body.other,

        image1: req.image1 ? req.image1.url : "",
        image2: req.image2 ? req.image2.url : "",
        image3: req.image3 ? req.image3.url : "",
        image4: req.image4 ? req.image4.url : "",
        image5: req.image5 ? req.image5.url : "",
      });
      const productadded = savedata.save();

      console.log("imageupload");
      res.send(savedata);
    }
  } catch (er) {
    console.log(er);
  }
}
//delete products
async function productdelete(req, res) {
  console.log(req.params.id);
  const find = await Product.findByIdAndDelete(req.params.id);

  if (!find) {
    res.send({ message: "id not found" });
  } else {
    res.send({ message: "product is removed" });
  }
}
//user
//show all product

async function product(req, res) {
  const data = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        "category.active": true,
        active: true,
      },
    },

    {
      $project: {
        "category._id": true,
        "category.categoryname": true,
        productname: 1,
        price: 1,
        details: 1,
        quantity: 1,
        image1: 1,
        image2: 1,
        image3: 1,
        date: 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]);
  if (data.length == 0) {
    return res.status(500).json({
      message: "data not foound..",
    });
  } else {
    res.status(200).send(data);
  }
}

//show all product by product name

async function productByname(req, res) {
  console.log(req.body);
  console.log("req.body");
  const { error } = await validproductname(req.body);
  if (error) {
    return res.send({
      message: error.details[0].message,
    });
  }
  const data = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        "category.active": true,
        active: true,
        productname: { $regex: req.body.productname },
      },
    },

    {
      $project: {
        productname: 1,
        price: 1,
        details: 1,
        quantity: 1,
        image1: 1,
        image2: 1,
        image3: 1,
      },
    },
  ]);
  if (data.length == 0) {
    return res.status(200).json({
      message: "data not foound..",
    });
  } else {
    res.send({
      message: "product find....",
      data: data,
    });
  }
}

// show all product by category name
async function productbycategory(req, res) {
  const { error } = await validproductserch(req.body);
  const productdata = await Product.find();

  if (error) {
    return res.status(404).send({ messege: error.details[0].message });
  }

  const data = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        "category.categoryname": req.body.categoryname,
        "category.active": true,
      },
    },

    {
      $project: {
        "category.categoryname": true,
        "category._id": true,
        productname: 1,
        price: 1,
        details: 1,
      },
    },
  ]);
  if (data.length == 0) {
    return res.status(200).json({
      message: "data not foound..",
    });
  } else {
    res.send({
      message: "successfull",
      data: data,
    });
  }
}
// show all product by id

async function uproductbyid(req, res) {
  console.log(req.params.id);

  const addproduct = await Product.findOne({ _id: req.params.id });
  console.log("doone");

  if (addproduct) {
    res.send({
      messege: "successull",
      data: addproduct,
    });
  } else {
    res.status(400).send({
      messege: "id not found",
    });
  }
}
//show all product by product name

async function productbyname(req, res) {
  const { error } = await validproductname(req.body);
  if (error) {
    return res.send({
      message: error.details[0].message,
    });
  }
  const data = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        "category.active": true,
        active: true,
        productname: { $regex: req.body.productname },
      },
    },

    {
      $project: {
        productname: 1,
        price: 1,
        details: 1,
        quantity: 1,
      },
    },
  ]);
  if (data.length == 0) {
    return res.status(200).json({
      message: "data not foound..",
    });
  } else {
    res.send({
      message: "product find....",
      data: data,
    });
  }
}

module.exports = {
  productbyid,
  updateproduct,
  findone,
  allproduct,
  productadd,
  productdelete, //

  product,
  productByname,
  productbycategory,
  uproductbyid,
};
