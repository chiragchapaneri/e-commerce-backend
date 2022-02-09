const { type } = require("express/lib/response");
const { boolean } = require("joi");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// mongoose
//   .connect("mongodb://localhost:27017/project", {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("db is connected"))
//   .catch((err) => console.log(err));
autoIncrement.initialize(mongoose.connection);

const Product = mongoose.model(
  "product",
  new mongoose.Schema({
    _id: Number,
    category: {
      type: Number,
      required: true,
      ref: "category",
    },
    productname: { type: String, required: true },
    // details: { type: Object, required: false },

    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    active: { type: Boolean, default: true },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    date: { type: Date, default: new Date() },
    ram: { type: String },
    processor: { type: String },
    size: { type: String },
    color: { type: String },
    storage: { type: String },
    other: { type: String },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = Product;
