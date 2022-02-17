const { boolean } = require("joi");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// mongoose
//   .connect("mongodb://localhost:27017/project")
//   .then(() => console.log("db is connected"))
//   .catch((err) => console.log(err));
autoIncrement.initialize(mongoose.connection);
const Category = mongoose.model(
  "category",
  new mongoose.Schema({
    categoryname: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    _id: { type: String },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = { Category };
