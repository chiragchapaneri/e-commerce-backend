const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const Feedback = mongoose.model(
  "feedback",
  new mongoose.Schema({
    _id: Number,
    userid: {
      type: Number,
      required: true,
      ref: "user",
    },
    productid: {
      type: Number,
      required: true,
      ref: "product",
    },

    message: {
      type: String,
      required: true,
    },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  })
);
module.exports = Feedback;
