const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const Country = mongoose.model(
  "country",
  new mongoose.Schema({
    _id: Number,
    state: { type: String, required: true },
    city: { type: String, required: true },
  }).plugin(autoIncrement.plugin, {
    model: "post",
    field: "_id",
    startAt: 1,
    incrementBy: 1,
  })
);

module.exports = { Country };
