const { boolean } = require("joi");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Product = require("./productmodel");

autoIncrement.initialize(mongoose.connection);

const Order = mongoose.model(
  "order",
  new mongoose.Schema({
    _id: { type: String },
    productid: {
      type: Number,
      ref: "product",
      required: true,
    },
    userid: {
      type: Number,
      ref: "user",
      required: true,
    },

    quantity: { type: Number, required: true },
    total: { type: Number },
    date: { type: Date, default: new Date() },
    addressline1: { type: String },
    addressline2: { type: String },
    city: { type: String },
    state: { type: String },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = Order;
