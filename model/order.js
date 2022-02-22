const { boolean } = require("joi");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Product = require("./productmodel");

autoIncrement.initialize(mongoose.connection);

const Order = mongoose.model(
  "order",
  new mongoose.Schema({
    id: { type: Number },
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
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
    field: "id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = Order;
