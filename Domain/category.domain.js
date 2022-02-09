const express = require("express");
const req = require("express/lib/request");
const route = express.Router();
const { categoryvalid, valid_updatecategory } = require("./validation");
const jwt = require("jsonwebtoken");
const { Category } = require("../model/categorymodel");

//admin

//show all categoruy
async function showcategory(req, res) {
  const findcategory = await Category.find();
  if (findcategory != 0) {
    res.status(200).send({ messege: "successfull", data: findcategory });
  } else {
    res.status(200).send({ messege: "data not found" });
  }
}
//delete category
async function deletecategory(req, res) {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  console.log(typeof deleted);
  console.log(deleted);
  if (deleted) {
    res.send({ messege: "successfull", data: deleted });
  } else {
    res.send({ messege: "id not found" });
  }
}

//add category
async function addcategory(req, res) {
  const valid = await categoryvalid(req.body);
  if (valid.error) {
    return res.send(valid.error.details[0].message);
  } else {
    const checkunique = await Category.findOne({
      categoryname: req.body.categoryname,
    });
    if (checkunique) {
      return res.status(404).send({
        message: "enter unique value..",
        value: req.body.categoryname,
      });
    } else {
      const adddata = new Category({ categoryname: req.body.categoryname });
      const datasve = await adddata.save();
      if (datasve) {
        res.status(200).send({ message: "data is added.." });
      }
    }
  }
}
//update category
async function updatecategory(req, res) {
  console.log(req.body);
  const data = await valid_updatecategory(req.body);
  if (data.error) {
    return res.send({ message: data.error.details[0].message });
  } else {
    const updatecat = await Category.findByIdAndUpdate(req.body.categoryid, {
      active: req.body.active,
    });

    if (updatecat) {
      const updatedata = await Category.findById(req.body.categoryid);

      return res.send({ messege: "update successfull", data: updatecat });
    } else {
      return res.send({ messege: "id not match" });
    }
  }
}

//user show category usershowcategory

async function usershowcategory(req, res) {
  const findcategory = await Category.find({ active: true });
  if (findcategory != 0) {
    res.status(200).send({ messege: "successfull", data: findcategory });
  } else {
    res.status(200).send({ messege: "data not found" });
  }
}

module.exports = {
  showcategory,
  addcategory,
  deletecategory,
  updatecategory,
  usershowcategory,
};
