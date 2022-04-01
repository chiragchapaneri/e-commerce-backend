const express = require("express");
const res = require("express/lib/response");
const Joi = require("joi");
const { Admin } = require("../model/adminmodel");

//validation function for user signup
async function uservalid(data) {
  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    address: Joi.string().alphanum().min(3).max(30).required(),
    city: Joi.string().alphanum().min(3).max(30).required(),
    state: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().alphanum().min(3).max(30).required(),
    mno: Joi.number().integer().min(10),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "gmail"] },
    }),
  });
  return schema.validate(data);
}

async function adminvalid(data) {
  const schema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().alphanum().min(3).max(30).required(),
    mno: Joi.number().integer().min(10),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "gmail"] },
    }),
  });
  return schema.validate(data);
}

async function categoryvalid(data) {
  const schema = Joi.object({
    categoryname: Joi.string().max(30).required(),
  });
  return schema.validate(data);
}

async function productvalid(data) {
  const schema = Joi.object({
    category: Joi.number().required().min(1),
    details: Joi.object(),

    productname: Joi.string().required().min(5),
    price: Joi.number().required().min(1),
    quantity: Joi.number().required().min(1),
  });

  return await schema.validate(data);
}
module.exports = { uservalid, adminvalid, categoryvalid, productvalid };
