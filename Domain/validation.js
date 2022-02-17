const express = require("express");
const { valid } = require("joi");
const Joi = require("joi");

//validation function for user signup
async function uservalid(data) {
  // const num = data.mno.toString();
  // if (num.length < 10) {
  //   return res.send({ message: "mno length must be 10" });
  // }
  data.Mno = data.mno.toString();
  console.log(data);
  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),

    flate_name: Joi.string().required(),
    nearby: Joi.string().required(),
    city: Joi.string(),
    state: Joi.string(),
    password: Joi.string().alphanum().min(8).max(30).required(),
    mno: Joi.number().integer().min(10).required(),
    Mno: Joi.string().length(10),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "gmail"] },
    }),
  });
  return schema.validate(data);
}

async function validmumber(data) {
  console.log("done");
}

async function valid_updatecategory(data) {
  console.log("done");
  const schema = Joi.object({
    categoryid: Joi.number().integer().min(1).required(),
    active: Joi.boolean().required(),
  });
  return schema.validate(data);
}

async function categoryvalid(data) {
  const schema = Joi.object({
    categoryname: Joi.string().max(30).required(),
  });
  console.log("invalid");
  return schema.validate(data);
}

async function validproductserch(data) {
  const schema = Joi.object({
    categoryname: Joi.string().required(),
  });
  return schema.validate(data);
}

async function adminvalid(data) {
  data.Mno = data.mno.toString();

  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().alphanum().min(3).max(30).required(),
    mno: Joi.number().integer(),
    Mno: Joi.string().length(10),

    // Mno=data.mno.tostring(),
    // Mno:Joi.string().length(5),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "gmail"] },
      })
      .required(),
  });
  return schema.validate(data);
}

async function categoryvalid(data) {
  const schema = Joi.object({
    categoryname: Joi.string().required(),
  });
  console.log("invalid");
  return schema.validate(data);
}

async function productvalid(data) {
  const schema = Joi.object({
    category: Joi.number().required().min(3),
    productname: Joi.string().required().min(5),
    price: Joi.number().min(1),
    quantity: Joi.number().min(1),
    ram: Joi.string(),
    processor: Joi.string(),
    size: Joi.string(),
    color: Joi.string(),
    storage: Joi.string(),
    other: Joi.string(),
  });

  return schema.validate(data);
}

async function update_productvalid(data) {
  const schema = Joi.object({
    productname: Joi.string(),
    price: Joi.number().min(1),
    quantity: Joi.number().min(1),
    details: Joi.object(),
    productid: Joi.number(),
    active: Joi.boolean(),
    ram: Joi.string(),
    processor: Joi.string(),
    size: Joi.string(),
    color: Joi.string(),
    storage: Joi.string(),
    other: Joi.string(),
  });

  return schema.validate(data);
}

async function productvalidupdate(data) {
  const schema = Joi.object({
    category: Joi.number().min(3),
    productname: Joi.string().min(5),
    price: Joi.number().min(1),
    quantity: Joi.number().min(1),
  });

  return schema.validate(data);
}

async function validproductname(data) {
  const schema = Joi.object({
    productname: Joi.string().required(),
  });

  return schema.validate(data);
}

async function validadress(data) {
  const schema = Joi.object({
    addressline1: Joi.string().required(),
    addressline2: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  });
  return schema.validate(data);
}

async function vlidfeedback(data) {
  const schecma = Joi.object({
    productid: Joi.number().required(),
    message: Joi.string().required(),
  });

  return schecma.validate(data);
}

module.exports = {
  uservalid,
  adminvalid,
  categoryvalid,
  productvalid,
  validproductserch,
  validproductname,
  productvalidupdate,
  validadress,
  vlidfeedback,
  valid_updatecategory,
  update_productvalid,
};
