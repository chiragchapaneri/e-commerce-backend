const express = require("express");
const mongoose = require("mongoose");

const req = require("express/lib/request");
const route = express.Router();
const { update_productvalid } = require("./validation");
const jwt = require("jsonwebtoken");
const Product = require("../model/productmodel");
const Cart = require("../model/productmodel");
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
  const addproduct = await Product.find().populate("category");

  if (addproduct.length != 0) {
    return res.send({ data: addproduct });
  } else {
    res.send({ messege: "data not founf" });
  }
}

async function fillterproduct(req, res) {
  if (req.body.price) {
    const sortdata = await Product.find()
      .populate({
        path: "category",
        model: "category",
        select: ["categoryname"],
      })
      .sort({ price: parseInt(req.body.price) });

    if (sortdata.length != 0) {
      res.send({ data: sortdata });
    } else {
      res.send({ messege: "data not founf" });
    }
  }
  if (req.body.name) {
    const sortdata = await Product.find()
      .populate({
        path: "category",
        model: "category",
        select: ["categoryname"],
      })
      .sort({ productname: parseInt(req.body.name) });

    if (sortdata.length != 0) {
      res.send({ data: sortdata });
    } else {
      res.send({ messege: "data not founf" });
    }
  }
  if (req.body.category) {
    const sortdata = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $sort: {
          "category.categoryname": parseInt(req.body.category)
            ? parseInt(req.body.category)
            : 1,
        },
      },

      {
        $project: {
          "category.categoryname": true,
          productname: 1,
          price: 1,
          quantity: 1,
          image1: 1,

          active: 1,
        },
      },
    ]);

    if (sortdata.length != 0) {
      res.send({ data: sortdata });
    } else {
      res.send({ messege: "data not founf" });
    }
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

        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $project: {
        "category.categoryname": true,
        productname: 1,
      },
    },
  ]);
  if (productdata != 0) res.send(productdata);
  else {
    res.send("done");
  }
}

//update product
async function updateproduct(req, res) {
  const price = parseInt(req.body.price);

  const data = await update_productvalid(req.body);
  if (data.error) {
    return res.send({ message: data.error.details[0].message });
  } else {
    const find = await Product.findById(req.body.productid);
    if (!find) {
      return res.status(400).send({ message: "id not found" });
    } else {
      const updateproduct = await Product.findByIdAndUpdate(
        req.body.productid,
        {
          productname: req.body.productname
            ? req.body.productname
            : find.productname,
          price: req.body.price ? parseInt(req.body.price) : find.price,
          quantity: req.body.quantity,
          active: req.body.active,
          image1: req.image1 ? req.image1.url : find.image1,
          image2: req.image2 ? req.image2.url : find.image2,
          image3: req.image3 ? req.image3.url : find.image3,

          ram: req.body.ram,
          processor: req.body.processor,
          size: req.body.size,
          color: req.body.color,
          storage: req.body.storage,

          date: new Date(),
        }
      );

      const data = await Product.findById(req.body.productid);

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
  // const valid = await productvalid(req.body);

  try {
    const images = await uploadimages(req.files);

    // if (valid.error) {
    //   return res.send({ err: valid.error.details[0] });
    // } else {
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

    res.send(savedata);
    // }
  } catch (er) {}
}
//delete products
async function productdelete(req, res) {
  const find = await Product.findByIdAndDelete(req.params.id);

  if (!find) {
    res.send({ message: "id not found" });
  } else {
    res.send({ message: "product is removed" });
  }
}
//user
//show all product

async function newall(req, res) {
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
  const { error } = await validproductname(req.body);
  if (error) {
    return res.send({
      message: error.details[0].message,
    });
  }

  const data = await Product.find({
    productname: { $regex: req.body.productname },
  }).populate("category");

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
  try {
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
          "category.categoryname": req.params.id,
        },
      },

      {
        $project: {
          "category.categoryname": true,
          "category._id": true,
          productname: 1,
          price: 1,
          details: 1,
          image1: 1,
          status: 1,
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
  } catch (er) {
    console.log(er);
  }
}
// show all product by id

async function uproductbyid(req, res) {
  const addproduct = await Product.findOne({ _id: req.params.id });
  console.log("kabsjcbjasbcjbaskjcbjakscbjkbsac");

  if (addproduct) {
    res.send({
      messege: "successull ascasc",
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
  console.log(req.body.productname);
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
      },
    },
  ]);
  if (data.length == 0) {
    return res.status(200).json({
      message: "data not a foound..",
    });
  } else {
    res.send({
      message: "product find....",
      data: data,
    });
  }
}

async function productfilter(req, res) {
  if (req.body.value === "high-low") {
    const data = await Product.find().populate("category").sort({ price: -1 });

    const filterdata = data.filter((data) => {
      return data.category.categoryname === req.body.category;
    });

    return res.status(200).send(filterdata);
  }
  if (req.body.value === "low-high") {
    const data = await Product.find().sort({ price: 1 }).populate("category");
    const filterdata = data.filter((data) => {
      return data.category.categoryname === req.body.category;
    });
    return res.status(200).send(filterdata);
  }
  if (req.body.value === "latest") {
    const data = await Product.find().sort({ date: -1 }).populate("category");
    const filterdata = data.filter((data) => {
      return data.category.categoryname === req.body.category;
    });
    return res.status(200).send(filterdata);
  }
}

module.exports = {
  productbyid,
  updateproduct,
  findone,
  allproduct,
  productadd,
  productdelete, //
  fillterproduct,
  productfilter,
  newall,
  productByname,
  productbycategory,
  uproductbyid,
};
